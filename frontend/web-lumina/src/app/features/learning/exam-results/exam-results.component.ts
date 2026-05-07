// features/learning/exam-results/exam-results.component.ts
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../services/exam.service';
import { CertificateService } from '../services/certificate.service';
import { CourseService } from '../../courses/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-results.component.html',
  styleUrls: ['./exam-results.component.scss'],
})
export class ExamResultsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private examService = inject(ExamService);
  private certificateService = inject(CertificateService);
  private courseService = inject(CourseService);
  private authService = inject(AuthService);

  score    = signal<number>(0);
  courseId = signal<string>('');
  passed   = computed(() => this.examService.isPassed(this.score()));
  downloading = signal(false);

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    this.score.set(Number(params.get('score') ?? 0));
    this.courseId.set(params.get('courseId') ?? '');
  }

  downloadCertificate(): void {
    this.downloading.set(true);

    // Obtener datos del curso y usuario
    this.courseService.getById(this.courseId()).subscribe({
      next: (course) => {
        const user = this.authService.currentUser();
        const studentName = user?.name ?? 'Estudiante';
        const instructorName = course?.instructor ?? 'CodeForge Academy';
        const courseName = course?.title ?? this.courseId();
        const date = new Date().toLocaleDateString('es-ES', {
          day: '2-digit', month: 'long', year: 'numeric'
        });

        this.certificateService.generatePDF(courseName, studentName, instructorName, this.score(), date);
        this.downloading.set(false);
      },
      error: () => {
        // Fallback si el servicio falla
        const studentName = this.authService.currentUser()?.name ?? 'Estudiante';
        const date = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
        this.certificateService.generatePDF(this.courseId(), studentName, 'CodeForge Academy', this.score(), date);
        this.downloading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/learning/course', this.courseId()]);
  }

  retakeExam(): void {
    this.router.navigate(['/learning/exam', this.courseId()]);
  }
}
