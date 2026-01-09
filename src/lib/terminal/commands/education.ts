import type { Command, CommandResult, Education } from '../types';
import { createLine } from '../utils';
import { getContentData } from '../file-system';

export const educationCommand: Command = {
  name: 'education',
  description: 'Display education history',
  usage: 'education',
  aliases: ['edu', 'school'],
  execute: (): CommandResult => {
    const educationData = getContentData('education') as Education[] | undefined;

    // Default education data
    const defaultEducation: Education[] = [
      {
        institution: 'University of Technology',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        period: '2014 - 2018',
        location: 'San Francisco, CA',
        gpa: '3.8',
        highlights: [
          'Dean\'s List all semesters',
          'Senior capstone: Distributed systems project',
          'Teaching assistant for Data Structures course',
        ],
      },
      {
        institution: 'Online Learning',
        degree: 'Professional Certifications',
        field: 'Various',
        period: '2018 - Present',
        location: 'Remote',
        highlights: [
          'AWS Solutions Architect Associate',
          'Google Cloud Professional Developer',
          'Kubernetes Administrator (CKA)',
        ],
      },
    ];

    const education = educationData ?? defaultEducation;

    const lines: string[] = [];
    lines.push('');
    lines.push('+------------------------------------------------------------------+');
    lines.push('|                          EDUCATION                               |');
    lines.push('+------------------------------------------------------------------+');
    lines.push('');

    for (const edu of education) {
      // Certificate-style box
      lines.push('  +------------------------------------------------------------+');
      lines.push(`  |  <span class="term-yellow font-bold">[*] ${edu.degree}</span>`);
      lines.push(`  |      <span class="term-cyan">${edu.field}</span>`);
      lines.push('  |');
      lines.push(`  |  <span class="term-green">${edu.institution}</span>`);
      lines.push(`  |  <span class="term-dim">${edu.period} | ${edu.location}</span>`);

      if (edu.gpa) {
        lines.push(`  |  <span class="term-magenta">GPA: ${edu.gpa}</span>`);
      }

      if (edu.highlights && edu.highlights.length > 0) {
        lines.push('  |');
        for (const highlight of edu.highlights) {
          lines.push(`  |  <span class="term-dim">></span> ${highlight}`);
        }
      }

      lines.push('  +------------------------------------------------------------+');
      lines.push('');
    }

    return {
      output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
    };
  },
};
