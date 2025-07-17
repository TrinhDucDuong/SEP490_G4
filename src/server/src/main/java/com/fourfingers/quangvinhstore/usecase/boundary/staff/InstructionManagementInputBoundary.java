package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.staff.InstructionInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.InstructionOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListInstructionOutputData;
import org.springframework.security.core.userdetails.UserDetails;

public interface InstructionManagementInputBoundary {
    ListInstructionOutputData findAll();
    InstructionOutputData findById(String id);
    InstructionOutputData save(String id, InstructionInputData instructionInputData, UserDetails userDetails);
    InstructionOutputData delete(String id, UserDetails userDetails);
}
