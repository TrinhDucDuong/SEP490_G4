package com.fourfingers.quangvinhstore.infrastructure.schema;

import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ActionType;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ReferenceType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "action_logs")
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ActionLogEntity {
    @Id
    @Column(name = "action_log_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long actionLogId;

    @Column(name = "action_type")
    @Enumerated(EnumType.STRING)
    private ActionType actionType;

    @Column(name = "performer_id")
    private Long performerId;

    @Column(name = "reference_id")
    private Long referenceId;

    @Column(name = "action_time")
    private LocalDateTime actionTime;

    @Column(name = "reference_type")
    @Enumerated(EnumType.STRING)
    private ReferenceType referenceType;
}
