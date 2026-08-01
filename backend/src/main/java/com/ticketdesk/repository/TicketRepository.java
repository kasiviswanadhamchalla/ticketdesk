package com.ticketdesk.repository;

import com.ticketdesk.entity.Ticket;
import com.ticketdesk.entity.TicketStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long>, JpaSpecificationExecutor<Ticket> {
    
    Optional<Ticket> findByTicketNumber(String ticketNumber);

    Page<Ticket> findByCreatedById(Long userId, Pageable pageable);

    Page<Ticket> findByAssignedToId(Long engineerId, Pageable pageable);

    long countByStatus(TicketStatus status);

    @Query("SELECT t.status as status, COUNT(t) as count FROM Ticket t GROUP BY t.status")
    List<Map<String, Object>> countTicketsGroupByStatus();

    @Query("SELECT p.name as priority, COUNT(t) as count FROM Ticket t JOIN t.priority p GROUP BY p.name")
    List<Map<String, Object>> countTicketsGroupByPriority();

    @Query("SELECT c.name as category, COUNT(t) as count FROM Ticket t JOIN t.category c GROUP BY c.name")
    List<Map<String, Object>> countTicketsGroupByCategory();
}
