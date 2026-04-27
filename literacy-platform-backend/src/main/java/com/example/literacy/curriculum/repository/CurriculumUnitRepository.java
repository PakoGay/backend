package com.example.literacy.curriculum.repository;

import com.example.literacy.curriculum.model.CurriculumUnit;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CurriculumUnitRepository extends JpaRepository<CurriculumUnit, Long> {
    List<CurriculumUnit> findAllByOrderBySortOrderAsc();
    List<CurriculumUnit> findAllByPublishedTrueOrderBySortOrderAsc();
    long countByPublishedTrue();
}
