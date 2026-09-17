package com.veridian.execagent.repository;

import com.veridian.execagent.model.Commitment;
import com.veridian.execagent.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommitmentRepository extends JpaRepository<Commitment, Long> {
    List<Commitment> findByOwner(Person owner);
    List<Commitment> findByStatus(String status);
    List<Commitment> findByPriority(String priority);
    List<Commitment> findByOwnerIsNullOrOwner(Person owner);
}
