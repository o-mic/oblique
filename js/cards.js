import { gsap } from './vendor/gsap.min.js';
import { CustomEase } from './vendor/CustomEase.min.js';

gsap.registerPlugin(CustomEase);

gsap.defaults({
    ease: CustomEase.create("custom", "0.65, 0, 0.35, 1")
});

document.addEventListener("DOMContentLoaded", async () => {

    // card shuffle
    const bodyEl = document.querySelector("body");
    const container = document.querySelector("#ajax-container");
    const loader = document.querySelector("#ajax-load");

    const cardFront = document.querySelector("#card--front");
    const titleEl = document.querySelector("#card-title");
    const cardTitleEl = document.querySelector("#card-front-title");
    const summaryEl = document.querySelector("#card-summary");
    const cardSummaryEl = document.querySelector("#card-front-summary");
    const imgBackEl = document.querySelector("#card-image-back");

    const cardQuote = document.querySelector('#card-quote');
    const cardQuoteCite = cardQuote.querySelector('cite');

    const cardExample = document.querySelector('#card-example');
    const cardExampleCite = cardExample.querySelector('cite');

    const cardConcept = document.querySelector('#card-concept');
    const cardConceptCite = cardConcept.querySelector('cite');

    const btn = document.querySelector("#shuffle-cards");

    let cards = [];
    let currentIndex = -1;

    async function loadCards() {
      try {
        const res = await fetch("/data/cards.json");
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        cards = await res.json();

        if (!Array.isArray(cards) || cards.length === 0) {
          throw new Error("Cards data is empty or invalid.");
        }

        showRandomCard(); // first load
      } catch (err) {
        console.error("Failed to load cards:", err);
        titleEl.textContent = "Error loading cards.";
        summaryEl.textContent = "";
      }
    }

    function getRandomCard() {
      if (cards.length === 0) return null;

      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * cards.length);
      } while (newIndex === currentIndex && cards.length > 1);

      currentIndex = newIndex;
      return cards[newIndex];
    }

    async function showRandomCard() {
      const card = getRandomCard();
      if (!card) return;

      try {
        // Animate out old content
        await gsap.to(container, { opacity: 0, duration: 0.4 }).then();
        bodyEl.classList.remove(...bodyEl.classList);
        cardFront.classList.remove(...cardFront.classList);

        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });

        // Swap in new data
        bodyEl.classList.add('bg-' + card.colour);
        cardFront.classList.add('bg-' + card.colour);
        titleEl.textContent = card.manoeuvre;
        cardTitleEl.textContent = card.manoeuvre;
        summaryEl.textContent = card.summary;
        cardSummaryEl.textContent = card.summary;
        imgBackEl.src = card.imageBack;
        imgBackEl.alt = card.title + " card back";

        if(card.quote && card.quote.trim() !== ""){
          cardQuote.querySelector('blockquote p').textContent = card.quote;
          cardQuoteCite.textContent = card.quote_cite;
          cardQuote.style.display = 'block';
        } else {
          cardQuote.style.display = 'none';
          cardQuoteCite.textContent = "";
          cardQuote.querySelector('blockquote p').textContent = "";
        }

        if(card.example && card.example.trim() !== ""){
          cardExample.querySelector('figure p').textContent = card.example;
          cardExampleCite.textContent = card.example_cite;
          cardExample.style.display = 'block';
        } else {
          cardExample.style.display = 'none';
          cardExample.querySelector('figure p').textContent = "";
          cardExampleCite.textContent = "";
        }

        if(card.concept && card.concept.trim() !== ""){
          cardConcept.querySelector('figure p').textContent = card.concept;
          cardConceptCite.textContent = card.concept_cite;
          cardConcept.style.display = 'block';
        } else {
          cardConcept.style.display = 'none';
          cardConcept.querySelector('figure p').textContent = "";
          cardConceptCite.textContent = "";
        }

        // Animate in new content
        await gsap.to(loader, { opacity: 0, duration: 0 }).then(
          gsap.fromTo(container,
            { opacity: 0 },
            { opacity: 1, duration: 0.6 }
          )
        );
      } catch (err) {
        console.error("Error showing card:", err);
      }
    }

    btn.addEventListener("click", showRandomCard);

    // Load everything
    await loadCards();
});