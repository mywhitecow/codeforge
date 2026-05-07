// features/learning/services/certificate.service.ts
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';

@Injectable({ providedIn: 'root' })
export class CertificateService {

  generatePDF(
    courseName: string,
    studentName: string,
    instructorName: string,
    score: number,
    date: string
  ): void {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    const W = doc.internal.pageSize.getWidth();   // 297mm
    const H = doc.internal.pageSize.getHeight();  // 210mm

    // ── Fondo oscuro ──────────────────────────────────────────────────────
    doc.setFillColor(15, 23, 42); // #0F172A
    doc.rect(0, 0, W, H, 'F');

    // ── Borde decorativo ─────────────────────────────────────────────────
    doc.setDrawColor(56, 189, 248);  // #38BDF8
    doc.setLineWidth(1.5);
    doc.rect(8, 8, W - 16, H - 16);

    // ── Ícono / Logo texto ────────────────────────────────────────────────
    doc.setTextColor(56, 189, 248);  // acento sky
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('CodeForge Academy', W / 2, 24, { align: 'center' });

    // ── Línea superior ────────────────────────────────────────────────────
    doc.setLineWidth(0.5);
    doc.line(30, 30, W - 30, 30);

    // ── Título principal ──────────────────────────────────────────────────
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICADO DE FINALIZACIÓN', W / 2, 60, { align: 'center' });

    // ── Subtítulo ─────────────────────────────────────────────────────────
    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);  // #94A3B8
    doc.text('Este documento certifica que:', W / 2, 78, { align: 'center' });

    // ── Nombre del estudiante ─────────────────────────────────────────────
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(studentName, W / 2, 100, { align: 'center' });

    // ── Línea bajo el nombre ──────────────────────────────────────────────
    doc.setDrawColor(56, 189, 248);
    doc.setLineWidth(0.4);
    const nameWidth = Math.min(doc.getTextWidth(studentName) + 20, 180);
    doc.line(W / 2 - nameWidth / 2, 104, W / 2 + nameWidth / 2, 104);

    // ── Descripción ───────────────────────────────────────────────────────
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('ha completado satisfactoriamente el curso:', W / 2, 116, { align: 'center' });

    // ── Nombre del curso ──────────────────────────────────────────────────
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(56, 189, 248);
    doc.text(courseName, W / 2, 132, { align: 'center' });

    // ── Columnas: instructor | nota | fecha ───────────────────────────────
    const col1 = W * 0.25;
    const col2 = W * 0.5;
    const col3 = W * 0.75;
    const rowLabel = 155;
    const rowValue = 162;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('INSTRUCTOR', col1, rowLabel, { align: 'center' });
    doc.text('CALIFICACIÓN', col2, rowLabel, { align: 'center' });
    doc.text('FECHA', col3, rowLabel, { align: 'center' });

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(instructorName, col1, rowValue, { align: 'center' });
    doc.text(`${score}/100`, col2, rowValue, { align: 'center' });
    doc.text(date, col3, rowValue, { align: 'center' });

    // ── Línea decorativa inferior ─────────────────────────────────────────
    doc.setDrawColor(56, 189, 248);
    doc.setLineWidth(1);
    doc.line(30, H - 22, W - 30, H - 22);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text('Este certificado fue generado digitalmente por CodeForge Academy · codeforge.academy', W / 2, H - 14, { align: 'center' });

    // ── Guardar ───────────────────────────────────────────────────────────
    const safeName = studentName.toLowerCase().replace(/\s+/g, '-');
    const safeCourse = courseName.toLowerCase().replace(/\s+/g, '-').substring(0, 20);
    doc.save(`certificado-${safeCourse}-${safeName}.pdf`);
  }
}
