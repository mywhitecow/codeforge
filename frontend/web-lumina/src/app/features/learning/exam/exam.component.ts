// features/learning/exam/exam.component.ts
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService, ExamQuestion } from '../services/exam.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss'],
})
export class ExamComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private examService = inject(ExamService);

  courseId = signal<string>('');
  questions = signal<ExamQuestion[]>([]);
  currentIndex = signal<number>(0);
  answers = signal<number[]>([]);
  selectedOption = signal<number | null>(null);

  currentQuestion = computed(() => this.questions()[this.currentIndex()]);
  isLastQuestion  = computed(() => this.currentIndex() === this.questions().length - 1);
  progressPercent = computed(() =>
    this.questions().length ? ((this.currentIndex() + 1) / this.questions().length) * 100 : 0
  );

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('courseId') ?? '';
    this.courseId.set(id);
    const qs = this.examService.getQuestions(id);
    this.questions.set(qs);
    this.answers.set(new Array(qs.length).fill(-1));
  }

  selectOption(index: number): void {
    this.selectedOption.set(index);
    const currentAnswers = [...this.answers()];
    currentAnswers[this.currentIndex()] = index;
    this.answers.set(currentAnswers);
  }

  next(): void {
    if (this.selectedOption() === null) return;
    if (this.isLastQuestion()) {
      this.finish();
    } else {
      const nextIdx = this.currentIndex() + 1;
      this.currentIndex.set(nextIdx);
      const savedAnswer = this.answers()[nextIdx];
      this.selectedOption.set(savedAnswer >= 0 ? savedAnswer : null);
    }
  }

  previous(): void {
    if (this.currentIndex() === 0) return;
    const prevIdx = this.currentIndex() - 1;
    this.currentIndex.set(prevIdx);
    const savedAnswer = this.answers()[prevIdx];
    this.selectedOption.set(savedAnswer >= 0 ? savedAnswer : null);
  }

  finish(): void {
    const score = this.examService.calculateScore(this.answers(), this.questions());
    this.router.navigate(['/learning/exam-results'], {
      queryParams: { score, courseId: this.courseId() },
    });
  }
}
