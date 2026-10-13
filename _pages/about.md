---
layout: about
title: about
permalink: /
subtitle: <span class="chinese-name">祁行健</span><div class="profile-info"><div class="position">Ph.D. Candidate · Ruprecht-Karls-Universität Heidelberg</div><div class="location">Heidelberg, BW, Germany</div></div>

selected_papers: false # includes a list of papers marked as "selected={true}"
social: false # contact icons are rendered below the page heading instead

announcements:
  enabled: true # includes a list of news items
  scrollable: true # adds a vertical scroll bar if there are more than 3 news items
  limit: 5 # leave blank to include all the news in the `_news` folder

latest_posts:
  enabled: true
  scrollable: true # adds a vertical scroll bar if there are more than 3 new posts items
  limit: 3 # leave blank to include all the blog posts
---

<div class="social about-contact">
  <div class="contact-icons">{% social_links %}</div>
</div>

I am a doctoral candidate in the [Application-Specific Computing](https://asc.ziti.uni-heidelberg.de/) group at ZITI, Heidelberg University, supervised by [Prof. Dr. Robert Strzodka](https://asc.ziti.uni-heidelberg.de/members/robert_strzodka/). I hold a B.E. from HIT, an M.S. from the UIUC, and an M.Sc. from ICL.

My research explores how computer arithmetic can make scientific computing more accurate and efficient. I am particularly interested in novel number formats and their trade-offs among precision, performance, and hardware cost. I also study numerical errors in mixed- and low-precision algorithms, alongside implementation techniques that translate their theoretical advantages into practical performance across hardware platforms.

Between my academic studies, I worked full-time as an Algorithm Engineer at Yum China. My primary responsibility was to design, implement, and deploy optimization algorithms for reducing the supply-chain and logistics costs of KFC and Pizza Hut. I also developed solutions for workforce planning and human-resource allocation. These operational problems were primarily formulated as mixed-integer programming models and deployed to support large-scale, real-world business decisions.

<!-- Alongside my research, I maintain [Resources]({{ '/resources/' | relative_url }}) for readers who want an introduction to [Floating-Point Arithmetic]({{ '/resources/floating-point-arithmetic/' | relative_url }}) and [Vectorization]({{ '/resources/vectorization/' | relative_url }}). -->

I welcome collaborations that connect arithmetic research with practical challenges in scientific computing.

#### Education Background

<div class="education-grid">
  <div class="education-entry">
    <div class="education-details">
      <strong>Ph.D. Candidate in Computer Engineering</strong>
      <span>Ruprecht-Karls-Universität Heidelberg · 2024–present</span>
    </div>
    <img class="education-symbol" src="https://www.uni-heidelberg.de/favicon.ico" alt="Heidelberg University symbol">
  </div>

  <div class="education-entry">
    <div class="education-details">
      <strong>M.Sc. in Applied Computational Science and Engineering</strong>
      <span>Imperial College London · 2022–2023</span>
    </div>
    <img class="education-symbol" src="{{ '/assets/img/imperial-college-shield.webp' | relative_url }}" alt="Imperial College London shield">
  </div>

  <div class="education-entry">
    <div class="education-details">
      <strong>M.S. in Civil and Environmental Engineering</strong>
      <span>University of Illinois Urbana–Champaign · 2018–2020</span>
    </div>
    <img class="education-symbol" src="{{ '/assets/img/uiuc-block-i.png' | relative_url }}" alt="University of Illinois Urbana-Champaign Block I">
  </div>

  <div class="education-entry">
    <div class="education-details">
      <strong>B.Eng. in Transportation Engineering</strong>
      <span>Harbin Institute of Technology · 2015–2019</span>
    </div>
    <img class="education-symbol" src="{{ '/assets/img/harbin-institute-of-technology-emblem.webp' | relative_url }}" alt="Harbin Institute of Technology emblem">
  </div>
</div>

#### Experiences

<div class="education-grid">
  <div class="education-entry">
    <div class="education-details">
      <strong>Algorithm Engineer</strong>
      <span>Yum China Holdings, Inc · 2021–2022</span>
    </div>
    <img class="education-symbol" src="{{ '/assets/img/Yum_China.png' | relative_url }}" alt="Yum China emblem">
  </div>

</div>


<style>
  .post-title {
    font-size: 2rem;
  }

  .chinese-name {
    display: inline-block;
    margin-bottom: 0.2rem;
    font-size: 2rem;
    letter-spacing: 0.15em;
    margin-left: 0.5em
  }

  .profile-info {
    margin-top: 1.2rem;
    line-height: 1.6;
  }

  .position {
    font-size: 1.2rem;
  }

  .location {
    margin-top: 0.3rem;
    font-size: 1.2rem;
  }


  .social .contact-icons {
    font-size: 1.8rem !important;
    line-height: 1.5;
  }

  .social .contact-icons a {
    margin: 0 0.3rem;
  }

  .about-contact {
    margin: 0.35rem 0 1.25rem;
    text-align: left;
  }

  .education-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin: 1rem 0 1.5rem;
  }

  .education-entry {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 1.25rem;
    text-align: left;
  }

  .education-details {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }

  .education-symbol {
    order: -1;
    width: 4.5rem;
    height: 4.5rem;
    margin-bottom: 0.45rem;
    object-fit: contain;
  }

  @media (max-width: 430px) {
    .education-symbol {
      width: 3.5rem;
      height: 3.5rem;
    }
  }

</style>
