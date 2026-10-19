import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for BragBook...');

  // Clean existing data (respecting foreign key order)
  await prisma.evidence.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Demo User
  const passwordHash = await bcrypt.hash('Password123!', 10);
  const demoUser = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      jobTitle: 'Senior Full Stack Engineer',
      company: 'TechFlow Systems',
      bio: 'Passionate software engineer building resilient distributed systems and crafting delightful developer experiences.',
    },
  });

  console.log(`👤 Created user: ${demoUser.name} (${demoUser.email})`);

  // 2. Create Projects
  const project1 = await prisma.project.create({
    data: {
      userId: demoUser.id,
      name: 'Payment Infrastructure Modernization',
      description: 'Architected and executed migration to event-driven Stripe checkout integration with zero downtime.',
      role: 'Lead Backend Engineer',
      technologies: ['Node.js', 'PostgreSQL', 'Stripe API', 'RabbitMQ', 'Docker'],
      startDate: new Date('2026-01-10'),
      endDate: new Date('2026-05-15'),
      status: 'COMPLETED',
    },
  });

  const project2 = await prisma.project.create({
    data: {
      userId: demoUser.id,
      name: 'Enterprise Analytics Dashboard',
      description: 'High-performance real-time analytics portal with sub-second response times on millions of events.',
      role: 'Full Stack Tech Lead',
      technologies: ['React', 'TanStack Query', 'Recharts', 'Express', 'Redis'],
      startDate: new Date('2026-04-01'),
      status: 'IN_PROGRESS',
    },
  });

  const project3 = await prisma.project.create({
    data: {
      userId: demoUser.id,
      name: 'Mobile Core Banking Integration',
      description: 'Biometric authorization and instant fund transfers for iOS and Android applications.',
      role: 'API Architect',
      technologies: ['Node.js', 'OAuth2', 'JWT', 'PostgreSQL'],
      startDate: new Date('2026-06-01'),
      status: 'IN_PROGRESS',
    },
  });

  console.log('🚀 Created 3 projects');

  // 3. Create Skills
  const skills = [
    { name: 'JavaScript / Node.js', category: 'Backend', level: 'EXPERT', yearsOfExperience: 6 },
    { name: 'React & Modern Frontend', category: 'Frontend', level: 'ADVANCED', yearsOfExperience: 5 },
    { name: 'PostgreSQL & Query Tuning', category: 'Database', level: 'ADVANCED', yearsOfExperience: 5 },
    { name: 'System Architecture & Microservices', category: 'Architecture', level: 'ADVANCED', yearsOfExperience: 4 },
    { name: 'Docker & Containerization', category: 'DevOps', level: 'INTERMEDIATE', yearsOfExperience: 3 },
    { name: 'Technical Leadership & Mentoring', category: 'Leadership', level: 'ADVANCED', yearsOfExperience: 3 },
  ];

  for (const s of skills) {
    await prisma.skill.create({
      data: {
        userId: demoUser.id,
        ...s,
      },
    });
  }
  console.log('💡 Created 6 skills');

  // 4. Create Goals
  const goals = [
    {
      title: 'Obtain AWS Certified Solutions Architect',
      description: 'Master advanced cloud networking, IAM policies, and serverless best practices.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      progress: 65,
      deadline: new Date('2026-10-31'),
    },
    {
      title: 'Mentor 2 Junior Engineers to Mid-level',
      description: 'Weekly 1:1 sessions, code review deep dives, and system design walk-throughs.',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      progress: 40,
      deadline: new Date('2026-12-31'),
    },
    {
      title: 'Publish Tech Blog Post on Distributed Locks',
      description: 'Write comprehensive article detailing Redis Redlock vs Postgres advisory locks.',
      status: 'COMPLETED',
      priority: 'LOW',
      progress: 100,
      deadline: new Date('2026-07-15'),
    },
  ];

  for (const g of goals) {
    await prisma.goal.create({
      data: {
        userId: demoUser.id,
        ...g,
      },
    });
  }
  console.log('🎯 Created 3 goals');

  // 5. Create Achievements & Evidence & Tags
  const tagPerf = await prisma.tag.create({ data: { userId: demoUser.id, name: 'Performance' } });
  const tagArch = await prisma.tag.create({ data: { userId: demoUser.id, name: 'Architecture' } });
  const tagRel = await prisma.tag.create({ data: { userId: demoUser.id, name: 'Release' } });

  const ach1 = await prisma.achievement.create({
    data: {
      userId: demoUser.id,
      projectId: project1.id,
      title: 'Reduced API response time by 69%',
      description: 'Optimized the product search and checkout verification API by restructuring SQL queries and adding composite database indexes.',
      date: new Date('2026-08-15'),
      category: 'TECHNICAL',
      impact: 'Reduced 95th percentile latency from 800ms to 250ms, supporting 3x higher peak traffic.',
      metrics: '69% latency reduction, 0 dropped transactions',
      tags: {
        connect: [{ id: tagPerf.id }, { id: tagArch.id }],
      },
      evidence: {
        create: [
          { title: 'Performance PR #428', url: 'https://github.com/example/repo/pull/428', type: 'GITHUB_PR' },
          { title: 'Datadog APM Dashboard', url: 'https://app.datadoghq.com/dashboard/apm-latency', type: 'DEPLOYMENT' },
        ],
      },
    },
  });

  const ach2 = await prisma.achievement.create({
    data: {
      userId: demoUser.id,
      projectId: project1.id,
      title: 'Zero-Downtime Payment Gateway Migration',
      description: 'Engineered dual-write sync and automated fallback mechanism for Stripe migration affecting $12M annual volume.',
      date: new Date('2026-05-10'),
      category: 'DELIVERY',
      impact: 'Saved $45k annually in merchant gateway transaction fees with 100% data integrity.',
      metrics: '$45,000 annual savings, 0 downtime',
      tags: { connect: [{ id: tagRel.id }] },
      evidence: {
        create: [
          { title: 'Architecture RFC Document', url: 'https://notion.so/rfc-payment-v2', type: 'DOCS' },
        ],
      },
    },
  });

  const ach3 = await prisma.achievement.create({
    data: {
      userId: demoUser.id,
      projectId: project2.id,
      title: 'Engineered Query Cache Layer for Analytics Portal',
      description: 'Implemented multi-tiered memory caching and optimized Redis invalidation pipeline for real-time dashboards.',
      date: new Date('2026-07-20'),
      category: 'TECHNICAL',
      impact: 'Decreased primary database load by 54% during peak morning business hours.',
      metrics: '54% database CPU relief',
      tags: { connect: [{ id: tagPerf.id }] },
    },
  });

  const ach4 = await prisma.achievement.create({
    data: {
      userId: demoUser.id,
      title: 'Led Frontend Engineering Guild Hackathon',
      description: 'Organized internal engineering hackathon resulting in 3 new developer productivity tooling prototypes.',
      date: new Date('2026-06-18'),
      category: 'LEADERSHIP',
      impact: 'Adopted internal component preview tool into daily workflow for 24 engineers.',
      metrics: '24 team members onboarded',
    },
  });

  const ach5 = await prisma.achievement.create({
    data: {
      userId: demoUser.id,
      projectId: project3.id,
      title: 'Biometric OAuth2 Security Flow Design',
      description: 'Designed and deployed compliant biometric authentication scheme meeting banking security standards.',
      date: new Date('2026-08-01'),
      category: 'PROBLEM_SOLVING',
      impact: 'Passed strict external SOC2 and banking partner compliance audits on first review.',
      metrics: '100% compliance audit pass',
      tags: { connect: [{ id: tagArch.id }] },
    },
  });

  console.log('🏆 Created 5 achievements with tags and evidence');

  // 6. Create Feedback
  const feedbacks = [
    {
      content: 'Alex led the payment migration with incredible attention to detail. Not a single payment was dropped during cutover.',
      source: 'VP of Engineering',
      category: 'Delivery & Reliability',
      date: new Date('2026-05-20'),
    },
    {
      content: 'The query optimizations on the search API completely unblocked our mobile launch. Exceptional deep-dive debugging skills.',
      source: 'Principal Architect',
      category: 'Technical Excellence',
      date: new Date('2026-08-16'),
    },
    {
      content: 'Alex has been an outstanding mentor. The structured code review feedback helped me step up to owning my first microservice.',
      source: 'Junior Software Engineer',
      category: 'Mentorship',
      date: new Date('2026-07-30'),
    },
  ];

  for (const f of feedbacks) {
    await prisma.feedback.create({
      data: {
        userId: demoUser.id,
        ...f,
      },
    });
  }
  console.log('💬 Created 3 feedback entries');

  console.log('✅ Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
