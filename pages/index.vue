<template>
  <div>
    <BoxingIntroVideo />

    <AnimatedSection>
      <HeroBanner />
    </AnimatedSection>

    <AnimatedSection>
      <TicketCard />
    </AnimatedSection>

    <AnimatedSection>
      <StadiumZoneSelector />
    </AnimatedSection>

    <AnimatedSection>
      <Contact />
    </AnimatedSection>
  </div>
</template>

<script setup>
import BoxingIntroVideo from "@/components/BoxingIntroVideo.vue";
import HeroBanner from "@/components/HeroBanner.vue";
import TicketCard from "@/components/TicketCard.vue";
import AnimatedSection from "@/components/AnimatedSection.vue";
import Contact from "../components/Contact.vue";
</script>
