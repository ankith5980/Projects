import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import Reveal, { RevealGroup, RevealItem } from './Reveal';
import DisplayType from './DisplayType';

const SkillsSection = React.memo(({ skills }) => {
  if (!skills || Object.keys(skills).length === 0) {
    return null;
  }

  return (
    <section className="section-padding relative overflow-hidden">
      <DisplayType solid="SKILLS" align="left" className="opacity-70" speed={40} slideIn={false} />

      <div className="container relative z-10 mx-auto container-padding">
        <Reveal className="mb-14 text-center">
          <span className="eyebrow">Toolkit</span>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl lg:text-5xl">
            Skills &amp; <span className="text-accent">Technologies</span>
          </h2>
          <p className="mt-3 text-base text-muted">Technologies I work with</p>
        </Reveal>

        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(skills).slice(0, 4).map(([category, categorySkills]) => (
            <RevealItem
              key={category}
              className="glass-violet group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-soft"
            >
              <h3 className="mb-4 font-display text-lg font-semibold capitalize text-accent">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(categorySkills) ? (
                  categorySkills.slice(0, 5).map((skill) => (
                    <span
                      key={skill._id || skill.name}
                      className="rounded-full border border-hairline bg-surface-2 px-3 py-1 text-xs font-medium text-muted transition-colors duration-200 group-hover:text-fg"
                    >
                      {skill.name}
                    </span>
                  ))
                ) : (
                  <span className="text-sm italic text-muted">No skills listed</span>
                )}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.2} className="mt-12 text-center">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-widest text-accent transition-all duration-200 hover:gap-3"
          >
            <span>View All Skills</span>
            <FaArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
});

SkillsSection.displayName = 'SkillsSection';

export default SkillsSection;
