// Content renderer for dynamic content types

import type { CommandResult, ContentData, About, Experience, SkillCategory, Education, BlogPost, ContactInfo, Hobby } from './types';
import { createLine, createProgressBar } from './utils';
import { getContentData } from './file-system';

/**
 * Render content data to terminal output
 */
export function renderContentData(content: ContentData): CommandResult {
  switch (content.type) {
    case 'about':
      return renderAbout();
    case 'experience':
      return renderExperience();
    case 'skills':
      return renderSkills();
    case 'education':
      return renderEducation();
    case 'blog':
      return renderBlogList();
    case 'contact':
      return renderContact();
    case 'hobbies':
      return renderHobbies();
    default:
      return {
        output: [createLine('[Content not available]', 'warning')],
      };
  }
}

function renderAbout(): CommandResult {
  const aboutData = getContentData('about') as About | undefined;

  const defaultAbout: About = {
    name: 'Daniel Boyle',
    title: 'Full-Stack Developer',
    tagline: 'Building the future, one commit at a time',
    bio: [
      'Passionate software engineer with 6+ years of experience building web applications.',
      'I love creating elegant solutions to complex problems and contributing to open source.',
      'When I\'m not coding, you\'ll find me exploring new technologies or hiking in the mountains.',
    ],
  };

  const about = aboutData ?? defaultAbout;

  const lines: string[] = [];
  lines.push('');
  lines.push('# ABOUT ME');
  lines.push('───────────────────────────────────────────────────────────');
  lines.push('');
  lines.push(`<span class="term-green font-bold">${about.name}</span>`);
  lines.push(`<span class="term-cyan">${about.title}</span>`);
  lines.push(`<span class="term-dim">"${about.tagline}"</span>`);
  lines.push('');
  
  for (const paragraph of about.bio) {
    lines.push(paragraph);
    lines.push('');
  }

  lines.push('───────────────────────────────────────────────────────────');
  lines.push('');
  lines.push('<span class="term-yellow">💡 TIP:</span> Run `neofetch` for a prettier overview!');
  lines.push('');

  return {
    output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
  };
}

function renderExperience(): CommandResult {
  const experienceData = getContentData('experience') as Experience[] | undefined;

  const defaultExperience: Experience[] = [
    {
      company: 'Current Company',
      role: 'Senior Developer',
      period: '2022 - Present',
      location: 'Remote',
      description: 'Leading development of cloud-native applications.',
      highlights: ['Built scalable microservices', 'Mentored junior developers'],
      technologies: ['TypeScript', 'React', 'Node.js'],
    },
  ];

  const experience = experienceData ?? defaultExperience;

  const lines: string[] = [];
  lines.push('');
  lines.push('# WORK EXPERIENCE');
  lines.push('═══════════════════════════════════════════════════════════════');
  lines.push('');

  for (const job of experience) {
    lines.push(`<span class="term-green font-bold">${job.role}</span> @ <span class="term-cyan">${job.company}</span>`);
    lines.push(`<span class="term-dim">${job.period} | ${job.location}</span>`);
    lines.push('');
    lines.push(job.description);
    lines.push('');
    lines.push('<span class="term-yellow">Highlights:</span>');
    for (const highlight of job.highlights) {
      lines.push(`  • ${highlight}`);
    }
    lines.push('');
    lines.push(`<span class="term-magenta">Stack: ${job.technologies.join(' • ')}</span>`);
    lines.push('');
    lines.push('───────────────────────────────────────────────────────────────');
    lines.push('');
  }

  lines.push('<span class="term-dim">Run `experience` for the full interactive experience view</span>');
  lines.push('');

  return {
    output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
  };
}

function renderSkills(): CommandResult {
  const skillsData = getContentData('skills') as SkillCategory[] | undefined;

  const defaultSkills: SkillCategory[] = [
    {
      name: 'Languages',
      icon: '💻',
      skills: [
        { name: 'TypeScript', level: 95 },
        { name: 'JavaScript', level: 95 },
        { name: 'Python', level: 85 },
      ],
    },
  ];

  const skills = skillsData ?? defaultSkills;

  const lines: string[] = [];
  lines.push('');
  lines.push('# TECHNICAL SKILLS');
  lines.push('═══════════════════════════════════════════════════════════════');
  lines.push('');

  for (const category of skills) {
    lines.push(`<span class="term-cyan font-bold">${category.icon} ${category.name}</span>`);
    lines.push('');
    
    for (const skill of category.skills) {
      const bar = createProgressBar(skill.level, 20, '▓', '░');
      lines.push(`  ${skill.name.padEnd(15)} <span class="term-green">${bar}</span> ${skill.level}%`);
    }
    lines.push('');
  }

  lines.push('<span class="term-dim">Run `skills` for the full interactive skills view</span>');
  lines.push('');

  return {
    output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
  };
}

function renderEducation(): CommandResult {
  const educationData = getContentData('education') as Education[] | undefined;

  const defaultEducation: Education[] = [
    {
      institution: 'University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      period: '2014 - 2018',
      location: 'Location',
    },
  ];

  const education = educationData ?? defaultEducation;

  const lines: string[] = [];
  lines.push('');
  lines.push('# EDUCATION');
  lines.push('═══════════════════════════════════════════════════════════════');
  lines.push('');

  for (const edu of education) {
    lines.push(`<span class="term-green font-bold">🎓 ${edu.degree} in ${edu.field}</span>`);
    lines.push(`   <span class="term-cyan">${edu.institution}</span>`);
    lines.push(`   <span class="term-dim">${edu.period} | ${edu.location}</span>`);
    if (edu.gpa) {
      lines.push(`   <span class="term-yellow">GPA: ${edu.gpa}</span>`);
    }
    lines.push('');
  }

  lines.push('<span class="term-dim">Run `education` for the full view</span>');
  lines.push('');

  return {
    output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
  };
}

function renderBlogList(): CommandResult {
  const blogData = getContentData('blog') as BlogPost[] | undefined;

  const lines: string[] = [];
  lines.push('');
  lines.push('# BLOG');
  lines.push('═══════════════════════════════════════════════════════════════');
  lines.push('');

  if (blogData && blogData.length > 0) {
    for (const post of blogData.slice(0, 5)) {
      lines.push(`<span class="term-green">📝 ${post.title}</span>`);
      lines.push(`   <span class="term-dim">${post.date}</span>`);
      lines.push('');
    }
  } else {
    lines.push('Blog posts will appear here once content is loaded.');
    lines.push('');
  }

  lines.push('<span class="term-dim">Run `blog` for the full blog listing</span>');
  lines.push('');

  return {
    output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
  };
}

function renderContact(): CommandResult {
  const contactData = getContentData('contact') as ContactInfo | undefined;

  const defaultContact: ContactInfo = {
    email: 'hello@example.com',
    github: 'github.com/username',
    linkedin: 'linkedin.com/in/username',
    location: 'Location',
    availability: 'Open to opportunities',
  };

  const contact = contactData ?? defaultContact;

  const lines: string[] = [];
  lines.push('');
  lines.push('# CONTACT');
  lines.push('═══════════════════════════════════════════════════════════════');
  lines.push('');
  lines.push(`<span class="term-cyan">📧 Email:</span>    <span class="term-green">${contact.email}</span>`);
  lines.push(`<span class="term-cyan">🐙 GitHub:</span>   ${contact.github}`);
  lines.push(`<span class="term-cyan">💼 LinkedIn:</span> ${contact.linkedin}`);
  if (contact.twitter) {
    lines.push(`<span class="term-cyan">🐦 Twitter:</span>  ${contact.twitter}`);
  }
  lines.push(`<span class="term-cyan">📍 Location:</span> ${contact.location}`);
  lines.push(`<span class="term-cyan">💼 Status:</span>   <span class="term-green">${contact.availability}</span>`);
  lines.push('');
  lines.push('<span class="term-dim">Run `contact` for more details</span>');
  lines.push('');

  return {
    output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
  };
}

function renderHobbies(): CommandResult {
  const hobbiesData = getContentData('hobbies') as Hobby[] | undefined;

  const defaultHobbies: Hobby[] = [
    { name: 'Coding', icon: '💻', description: 'Building side projects and contributing to open source' },
    { name: 'Gaming', icon: '🎮', description: 'Strategy and puzzle games' },
    { name: 'Reading', icon: '📚', description: 'Tech books and sci-fi novels' },
    { name: 'Hiking', icon: '🥾', description: 'Exploring nature and mountains' },
  ];

  const hobbies = hobbiesData ?? defaultHobbies;

  const lines: string[] = [];
  lines.push('');
  lines.push('# HOBBIES & INTERESTS');
  lines.push('═══════════════════════════════════════════════════════════════');
  lines.push('');

  for (const hobby of hobbies) {
    lines.push(`<span class="term-cyan">${hobby.icon} ${hobby.name}</span>`);
    lines.push(`   ${hobby.description}`);
    lines.push('');
  }

  lines.push('<span class="term-dim">Life isn\'t all about code... but mostly it is! 😄</span>');
  lines.push('');

  return {
    output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
  };
}

