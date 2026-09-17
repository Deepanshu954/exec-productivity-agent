package com.veridian.execagent.repository;

import com.veridian.execagent.model.CalendarEvent;
import com.veridian.execagent.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {
    List<CalendarEvent> findByPersonOrderByIsoDateAscStartTimeAsc(Person person);
    List<CalendarEvent> findByIsoDateOrderByStartTimeAsc(String isoDate);
    List<CalendarEvent> findByPersonAndIsoDateOrderByStartTimeAsc(Person person, String isoDate);
}
