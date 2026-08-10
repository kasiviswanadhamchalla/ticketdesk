-- TicketDesk Seed Data Migration V2 (MySQL 8.0)
-- Initial Roles, Categories, Priorities, and Admin/Test Users

INSERT IGNORE INTO roles (id, name) VALUES 
(1, 'ROLE_ADMIN'),
(2, 'ROLE_SUPPORT_ENGINEER'),
(3, 'ROLE_EMPLOYEE');

INSERT IGNORE INTO categories (id, name, description) VALUES
(1, 'Hardware', 'Physical equipment issues such as laptops, monitors, printers, and peripherals'),
(2, 'Software', 'Application crashes, license requests, software installations, and bugs'),
(3, 'Network & Access', 'VPN, Wi-Fi connectivity, firewall requests, and network latency'),
(4, 'Account & IAM', 'Password resets, Active Directory, multi-factor authentication, and permissions'),
(5, 'Cloud Infrastructure', 'AWS resources, server deployments, database access, and DevOps support');

INSERT IGNORE INTO priorities (id, name, description, color_code, sla_hours) VALUES
(1, 'LOW', 'Minor issue or request with minimal impact on business operations', '#10B981', 72),
(2, 'MEDIUM', 'Standard issue affecting individual productivity with available workaround', '#3B82F6', 24),
(3, 'HIGH', 'Significant disruption affecting multiple users or critical workflow', '#F59E0B', 8),
(4, 'URGENT', 'Critical system outage or severe vulnerability requiring immediate response', '#EF4444', 2);

-- Seed default users (Password for all seeded accounts is: Admin@123)
-- BCrypt hash for 'Admin@123': $2a$10$Pc6HSMH0w/Q/T77XjhbQeeL.DAdlcsyqLewksnAAsjFyG.s6ommeW
INSERT IGNORE INTO users (id, username, email, password_hash, first_name, last_name, role_id, is_active) VALUES
(1, 'admin', 'admin@ticketdesk.com', '$2a$10$Pc6HSMH0w/Q/T77XjhbQeeL.DAdlcsyqLewksnAAsjFyG.s6ommeW', 'System', 'Administrator', 1, TRUE),
(2, 'support1', 'support@ticketdesk.com', '$2a$10$Pc6HSMH0w/Q/T77XjhbQeeL.DAdlcsyqLewksnAAsjFyG.s6ommeW', 'Sarah', 'Conner', 2, TRUE),
(3, 'employee1', 'employee@ticketdesk.com', '$2a$10$Pc6HSMH0w/Q/T77XjhbQeeL.DAdlcsyqLewksnAAsjFyG.s6ommeW', 'John', 'Doe', 3, TRUE);

-- Seed Sample Tickets
INSERT IGNORE INTO tickets (id, ticket_number, title, description, status, priority_id, category_id, created_by_id, assigned_to_id) VALUES
(1, 'TICK-1001', 'MacBook Display Flickering and Blank Screen', 'My secondary display attached via Thunderbolt is flickering constantly and going blank after 10 minutes.', 'OPEN', 2, 1, 3, 2),
(2, 'TICK-1002', 'VPN Access Credentials Renewal Required', 'Unable to connect to US-East corporate VPN endpoint. Error code 403 authorization failure.', 'IN_PROGRESS', 3, 3, 3, 2),
(3, 'TICK-1003', 'Docker Desktop License Key Activation', 'Need enterprise Docker Desktop license key activated for team development workstation.', 'RESOLVED', 1, 2, 3, 2);
