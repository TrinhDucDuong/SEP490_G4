package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Instruction;
import com.fourfingers.quangvinhstore.infrastructure.schema.InstructionEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface InstructionStaffMapper {
    Instruction toModel(InstructionEntity instruction);
    InstructionEntity toEntity(Instruction instruction);
}
