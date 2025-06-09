package com.fourfingers.quangvinhstore.infrastructure.persistence.mapper;

import com.fourfingers.quangvinhstore.domain.model.Instruction;
import com.fourfingers.quangvinhstore.infrastructure.schema.InstructionEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface InstructionMapper {
    Instruction toInstruction(InstructionEntity entity);
    InstructionEntity toInstructionEntity(Instruction instruction);
}
