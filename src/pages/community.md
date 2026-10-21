---
layout: default
title: Community
permalink: /community/
---

<section class="hero hero--breakout hero--community">
  <div class="hero-inner">
    <h1 class="hero-headline">Bioinformatics will move forward as a profession when practitioners talk to each other.</h1>
    <p class="hero-subhead">Raise your voice.</p>
  </div>
</section>

## Resources

Tools and frameworks from and for the community to help us all practice bioinformatics consistently.

<ul class="entry-list">
  {% assign featured_resources = site.data.resources | where: "featured", true %}
  {% for resource in featured_resources %}
  <li>
    <article class="entry-card">
      <div class="entry-card-head">
        <h3>{{ resource.title }}</h3>
        <span class="entry-card-tag">{{ resource.category }}</span>
      </div>
      <p class="entry-card-blurb">{{ resource.blurb }}</p>
      <a
        class="btn btn-secondary entry-card-link"
        href="{{ resource.url }}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit {{ resource.title }} →
      </a>
    </article>
  </li>
  {% endfor %}
</ul>

## Get Involved

There's more than one way to get involved, from reading what other bioinformaticians are working through to talking it out with them directly.

<div class="cta-card-grid">
  <article class="cta-card">
    <p class="cta-card-eyebrow">Hear from us</p>
    <div class="cta-card-body">
      <h2>Read about the unresolved side of bioinformatics.</h2>
      <p>
        Essays, notes, and open letters from our community members. Specially around those topics that we don't talk enough about.
      </p>
      <a
        class="btn btn-primary"
        href="https://bioinfopro.substack.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Join the Substack
      </a>
    </div>
  </article>

  <article class="cta-card">
    <p class="cta-card-eyebrow">Get support</p>
    <div class="cta-card-body">
      <h2>Connect with other bioinformatics professionals.</h2>
      <p>
        Join a relaxed online community to talk about career paths, job leads, ideas, and yap about the secret life of a bioinformatician.
      </p>
      <a
        class="btn btn-primary"
        href="https://discord.gg/CKZGMBz4b"
        target="_blank"
        rel="noopener noreferrer"
      >
        Join the Discord
      </a>
    </div>
  </article>
</div>
