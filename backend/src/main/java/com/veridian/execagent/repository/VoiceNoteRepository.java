package com.veridian.execagent.repository;

import com.veridian.execagent.model.VoiceNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoiceNoteRepository extends JpaRepository<VoiceNote, Long> {
    List<VoiceNote> findAllByOrderByNoteNumberAsc();
}
