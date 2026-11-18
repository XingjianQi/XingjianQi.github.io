---
layout: page
title: Miscellaneous
permalink: /miscellaneous/
description: Random Personal Stuff
nav: true
nav_order: 5
images:
  lightbox2: true
---

<link rel="stylesheet" href="{{ '/assets/css/miscellaneous.css' | relative_url }}">

### My Home Town
I'm from [Qingdao](https://en.wikipedia.org/wiki/Qingdao), Shandong, China. It is a beautiful port city with beaches and plenty of German-style architecture. The city was a German colony in the early twentieth century, which is probably also why we make some of the best beer in China. Funnily enough, I never expected to end up studying in Germany. The vertical datum origin of China is also located in Qingdao.
<div class="row">
  <figure class="col-sm-6">
    <img
      class="img-fluid"
      src="{{ '/assets/img/qingdao1.jpg' | relative_url }}"
      alt="Description of the first image"
    >
    <figcaption>Old Town.</figcaption>
  </figure>

  <figure class="col-sm-6">
    <img
      class="img-fluid"
      src="{{ '/assets/img/qingdao2.jpg' | relative_url }}"
      alt="Modern City Centre."
    >
    <figcaption>Modern City Centre.</figcaption>
  </figure>
</div>

### Food Around the World

I'm a big foodie, so I always love trying the local specialities when I travel. Here are a few signature dishes I've sampled along the way.

<div class="mcdonalds-gallery">
  {% for photo in site.data.mcdonalds %}
    {% capture location %}{{ photo.city }}{% unless photo.city == photo.country %}, {{ photo.country }}{% endunless %}{% endcapture %}
    <figure class="mcdonalds-gallery__item">
      <a class="mcdonalds-gallery__window" href="{{ photo.image | relative_url }}" data-lightbox="mcdonalds-world" data-title="{{ location | escape }}" aria-label="View McDonald's in {{ location | escape }}">
        <img src="{{ photo.image | relative_url }}" alt="{{ photo.alt | escape }}" width="{{ photo.width }}" height="{{ photo.height }}" loading="lazy" decoding="async">
      </a>
      <figcaption>{{ location | escape }}</figcaption>
    </figure>
  {% endfor %}
</div>

### Randomly Persistent
I'm working towards Cosmic win streaks of [LinkedIn daily games](https://www.linkedin.com/games/). Expected to arrive by Jan. 2028. 


### Music
I played the violin for almost 6 years when I was a teenager. However, I never truly enjoyed it. Looking back now, I blame the teacher for making us play études instead of Justin Bieber's songs. Nevertheless, it makes it easier for me to learn other instruments.

### Mixer
Throughout my studies, I've always been mixing something: mixed-integer programming, mixed precision, or cement. As a matter of fact, mixing cement is the most endorsed skill on my LinkedIn page.
