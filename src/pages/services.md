---
layout: default
title: Services
permalink: /services/
---

<section class="hero hero--breakout hero--services">
  <div class="hero-inner">
    <p class="hero-headline">We help teams put skill-based standards into practice.</p>
    <p class="hero-subhead">Consulting, education, and evaluation for organizations and the people who do the work.</p>
    <a class="btn btn-primary" href="{{ site.contact_form_url }}" target="_blank" rel="noopener noreferrer">Talk to us</a>
  </div>
</section>

# Professional services

We work with organizations and practitioners who want their bioinformatics hiring, training, and assessment to reflect what the work actually takes. Here is where we can help.

<ul class="entry-list">
  {% for service in site.data.services %}
  {%- assign area = service.area | strip -%}
  {%- case area -%}
    {%- when 'Consulting' -%}{%- assign tag = 'gold' -%}
    {%- when 'Hiring' -%}{%- assign tag = 'brick' -%}
    {%- when 'AI Education' -%}{%- assign tag = 'olive' -%}
    {%- when 'Management' -%}{%- assign tag = 'fern' -%}
    {%- when 'Events' -%}{%- assign tag = 'taupe' -%}
    {%- when 'Education' -%}{%- assign tag = 'amber' -%}
    {%- else -%}{%- assign tag = 'berry' -%}
  {%- endcase -%}
  <li>
    <article class="entry-card">
      <div class="entry-card-head">
        <h3>{{ service.title | strip }}</h3>
        <span class="entry-card-tag entry-card-tag--{{ tag }}">{{ area }}</span>
      </div>
      <p class="entry-card-blurb">{{ service.blurb }}</p>
      {% if service.url %}
      <a
        class="btn btn-secondary entry-card-link"
        href="{{ service.url }}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more &rarr;
      </a>
      {% endif %}
    </article>
  </li>
  {% endfor %}
</ul>

## Pricing

We work mostly with small biotech teams, and we scope each engagement to the resources you have. Work is priced by the project or by the hour, depending on what you need.

<a class="btn btn-primary" href="{{ site.contact_form_url }}" target="_blank" rel="noopener noreferrer">Talk to us</a>



