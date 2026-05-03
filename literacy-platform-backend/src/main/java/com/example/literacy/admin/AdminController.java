package com.example.literacy.admin;

import com.example.literacy.admin.model.AdminActivityLog;
import com.example.literacy.common.api.PageResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public AdminService.Stats stats() {
        return adminService.stats();
    }

    @GetMapping("/logs")
    public PageResponse<LogResponse> logs(@RequestParam(defaultValue = "0") int page,
                                          @RequestParam(required = false) Integer size,
                                          @RequestParam(name = "page_size", required = false) Integer pageSize) {
        int resolvedSize = pageSize != null ? pageSize : (size == null ? 20 : size);
        PageResponse<AdminActivityLog> response = adminService.logs(page, resolvedSize);
        return new PageResponse<>(response.content().stream().map(LogResponse::from).toList(), response.page(), response.pageSize(), response.total(), response.totalPages());
    }

    public record LogResponse(Long id, Long adminId, String action, String entityType, Long entityId, String details, java.time.OffsetDateTime createdAt) {
        static LogResponse from(AdminActivityLog log) {
            return new LogResponse(log.getId(), log.getAdmin() == null ? null : log.getAdmin().getId(), log.getAction(), log.getEntityType(), log.getEntityId(), log.getDetails(), log.getCreatedAt());
        }
    }
}
