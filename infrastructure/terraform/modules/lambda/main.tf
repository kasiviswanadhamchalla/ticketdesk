# IAM Role for Lambda Function
resource "aws_iam_role" "lambda_exec" {
  name = "tkt-${var.owner}-${var.environment}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_policy" "lambda_s3_policy" {
  name        = "tkt-${var.owner}-${var.environment}-lambda-s3-policy"
  description = "Allows Lambda to read attachments and write thumbnails"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Resource = "${var.attachments_bucket_arn}/*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_s3_attach" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_s3_policy.arn
}

# Zip Archive for Lambda Handler
data "archive_file" "lambda_dummy" {
  type        = "zip"
  output_path = "${path.module}/dummy_lambda.zip"

  source {
    content  = "def handler(event, context):\n    print('Thumbnail processor invoked:', event)\n    return {'statusCode': 200}"
    filename = "index.py"
  }
}

# Lambda Function
resource "aws_lambda_function" "thumbnail_processor" {
  filename         = data.archive_file.lambda_dummy.output_path
  source_code_hash = data.archive_file.lambda_dummy.output_base64sha256
  function_name    = "tkt-${var.owner}-${var.environment}-thumbnail-processor"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.handler"
  runtime          = "python3.11"
  timeout          = 30
  memory_size      = 256

  tags = merge(var.tags, {
    Name = "tkt-${var.owner}-${var.environment}-thumbnail-processor"
  })
}

# Allow S3 to Invoke Lambda
resource "aws_lambda_permission" "allow_s3" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.thumbnail_processor.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = var.attachments_bucket_arn
}

# S3 Bucket Notification Trigger
resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = var.attachments_bucket_id

  lambda_function {
    lambda_function_arn = aws_lambda_function.thumbnail_processor.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "uploads/"
  }

  depends_on = [aws_lambda_permission.allow_s3]
}
