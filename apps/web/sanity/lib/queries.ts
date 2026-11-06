import { groq } from "next-sanity";
import { client, isConfigured } from "./client";

export interface Author {
  name: string;
  slug?: { current: string };
  image?: any;
  bio?: string;
}

export interface Category {
  title: string;
  slug?: { current: string };
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  coverImage?: any;
  excerpt?: string;
  author?: Author;
  categories?: Category[];
  body?: any;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
  };
}

export interface QuickBiteSignal {
  title: string;
  testedObservation: string;
  recommendation: string;
  link?: string;
}

export interface NewsletterIssue {
  _id: string;
  issueNumber: number;
  title: string;
  slug: { current: string };
  publishedAt: string;
  coverImage?: any;
  metaDescription?: string;
  author?: Author;
  emailSubject: string;
  emailExcerpt: string;
  tldr?: string[];
  personalizedIntro?: string;
  fullBody?: any;
  quickBites?: QuickBiteSignal[];
  actionableNextStep?: string;
  canonicalCtaLabel?: string;
  canonicalCtaUrl?: string;
  broadcastStatus?: "draft" | "ready" | "sent";
  broadcastSentAt?: string;
}

// GROQ Queries
export const postsQuery = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  coverImage,
  excerpt,
  "author": author->{name, slug, image},
  "categories": categories[]->{title, slug}
}`;

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  publishedAt,
  coverImage,
  excerpt,
  "author": author->{name, slug, image, bio},
  "categories": categories[]->{title, slug},
  body,
  seo
}`;

export const postSlugsQuery = groq`*[_type == "post" && defined(slug.current)][].slug.current`;

export const newslettersQuery = groq`*[_type == "newsletter" && defined(slug.current)] | order(issueNumber desc, publishedAt desc) {
  _id,
  issueNumber,
  title,
  slug,
  publishedAt,
  coverImage,
  metaDescription,
  "author": author->{name, slug, image, bio},
  emailSubject,
  emailExcerpt,
  tldr,
  actionableNextStep,
  broadcastStatus,
  broadcastSentAt
}`;

export const newsletterBySlugQuery = groq`*[_type == "newsletter" && slug.current == $slug][0] {
  _id,
  issueNumber,
  title,
  slug,
  publishedAt,
  coverImage,
  metaDescription,
  "author": author->{name, slug, image, bio},
  emailSubject,
  emailExcerpt,
  tldr,
  personalizedIntro,
  fullBody,
  quickBites,
  actionableNextStep,
  canonicalCtaLabel,
  canonicalCtaUrl,
  broadcastStatus,
  broadcastSentAt
}`;

export const newsletterSlugsQuery = groq`*[_type == "newsletter" && defined(slug.current)][].slug.current`;

// Fallback seed data for preview / when Sanity project is not connected yet
const FALLBACK_POSTS: BlogPost[] = [
  {
    _id: "seed-post-1",
    title: "Introducing Sound Goose: The Collaborative Audio Canvas",
    slug: { current: "introducing-sound-goose" },
    publishedAt: new Date("2026-10-15").toISOString(),
    excerpt:
      "A deep dive into how we are rethinking spatial sound, real-time audio collaboration, and the tools modern audio designers need.",
    author: { name: "Rachit", bio: "Founder & Audio Engineer at Sound Goose" },
    categories: [{ title: "Product" }, { title: "Audio Engineering" }],
    body: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Sound Goose was born out of frustration with disjointed audio workflows. Why should sharing a mix review feel like sending emails in 2004? Today, we're sharing our vision for fluid, spatial audio workflows.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Why Audio Workflows Need a Spatial Paradigm",
          },
        ],
        markDefs: [],
        style: "h2",
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Traditional timeline-based DAWs force linear thinking on fundamentally multi-dimensional soundscapes. By placing sound emitters on a shared canvas, artists and producers can collaborate with intuitive spatial awareness.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ],
  },
  {
    _id: "seed-post-2",
    title:
      "Mastering Spatial Audio Dynamics for Modern Interactive Experiences",
    slug: { current: "mastering-spatial-audio-dynamics" },
    publishedAt: new Date("2026-10-28").toISOString(),
    excerpt:
      "Techniques and mental models for designing acoustic presence, binaural panning, and dynamic distance falloff.",
    author: { name: "Team Sound Goose", bio: "The sound engineering crew" },
    categories: [{ title: "Deep Dive" }, { title: "Sound Design" }],
    body: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "When mixing interactive sound, real-world physics matter. From Doppler effects to head-related transfer functions (HRTF), modern sound designers have immense power at their fingertips.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ],
  },
];

const FALLBACK_NEWSLETTERS: NewsletterIssue[] = [
  {
    _id: "seed-issue-2",
    issueNumber: 2,
    title: "Zero-GC Convolution Reverb: Simulating Physical Rooms in Real Time",
    slug: { current: "zero-gc-convolution-reverb" },
    publishedAt: new Date("2026-11-02T10:00:00.000Z").toISOString(),
    metaDescription:
      "How to simulate physical room acoustics in WebAudio without garbage collection spikes. Real-time impulse response partitioning for web sound designers.",
    author: {
      name: "Rachit Agarwal",
      bio: "Founder & Lead Audio Systems Engineer at Sound Goose",
    },
    emailSubject: "Sound Goose #2: Zero-GC Convolution Reverb at 60 FPS",
    emailExcerpt:
      "Issue #2 explores physical room impulse responses, segmented frequency-domain convolution, and eliminating V8 GC pauses during live audio collaboration.",
    tldr: [
      "Direct time-domain convolution scales O(N*M), consuming 100% of CPU headroom for impulse responses longer than 2 seconds.",
      "Uniformly partitioned overlap-save FFT algorithms deliver studio-quality acoustics within a constant 128-sample budget.",
      "Pre-allocated WebAssembly memory heaps prevent memory fragmentation during dynamic spatial emitter movement.",
    ],
    personalizedIntro:
      "Acoustic realism lives or dies by reverberation. In traditional DAWs, loading an impulse response from a historic hall is trivial. In a collaborative web app with creators moving sound emitters simultaneously, standard ConvolverNodes quickly choke the audio thread. Here is how partitioned convolution solves this.",
    fullBody: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Reverberation is what grounds sound in physical reality. Without acoustic reflections, audio emitters feel clinical, disconnected, and artificial.",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        style: "h2",
        children: [
          {
            _type: "span",
            text: "The Physics of Impulse Responses and CPU Bottlenecks",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "An impulse response (IR) captures how a physical space reflects acoustic energy across time. When you convolve incoming dry audio with a 3-second stereo impulse response at 48kHz, the CPU must compute over 280,000 multiply-accumulate operations for every single output sample.",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        style: "h3",
        children: [
          {
            _type: "span",
            text: "Why Standard ConvolverNodes Fail Under Multi-Emitter Loads",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "WebAudio ConvolverNodes work well for static stereo stems. But when users drag emitters around a canvas, updating distance falloff and room sends in real time triggers memory allocations that force JavaScript engine GC pauses.",
          },
        ],
        markDefs: [],
      },
    ],
    quickBites: [
      {
        title: "Impulse response tail truncation",
        testedObservation:
          "Reverberation tails beyond -60dB (RT60) are completely inaudible beneath ambient noise but consume 45% of convolution CPU cycles.",
        recommendation:
          "Truncate impulse buffers at the -60dB threshold with an exponential decay curve to recover nearly half your compute headroom.",
        link: "https://www.w3.org/TR/webaudio/",
      },
    ],
    actionableNextStep:
      "Audit your reverb decay envelopes. Truncate impulse assets where tail energy drops below -60dB to free up DSP overhead.",
    canonicalCtaLabel: "Request Sound Goose Early Access",
    canonicalCtaUrl: "/#waitlist",
    broadcastStatus: "sent",
    broadcastSentAt: new Date("2026-11-02T10:00:00.000Z").toISOString(),
  },
  {
    _id: "seed-issue-1",
    issueNumber: 1,
    title:
      "Low-Latency Spatial Audio in the Browser: The WebAudio Worklet Blueprint",
    slug: { current: "low-latency-spatial-audio-in-the-browser" },
    publishedAt: new Date("2026-10-20T10:00:00.000Z").toISOString(),
    metaDescription:
      "How we achieved sub-6ms browser acoustics using AudioWorklet and SharedArrayBuffer. Practical architecture for spatial audio without garbage collection pauses.",
    author: {
      name: "Rachit Agarwal",
      bio: "Founder & Lead Audio Systems Engineer at Sound Goose",
    },
    emailSubject: "Sound Goose #1: Sub-6ms Spatial Audio in the Browser",
    emailExcerpt:
      "In our inaugural technical dispatch, we break down our WebAudio Worklet architecture, zero-allocation circular audio rings, and 3 measured takeaways for real-time web audio.",
    tldr: [
      "Direct main-thread WebAudio processing introduces unpreventable frame jitter and audio glitches whenever React renders.",
      "Offloading DSP into AudioWorklet processors with pre-allocated SharedArrayBuffers cuts round-trip acoustic latency to 5.8ms.",
      "Circular ring buffers bypass the JavaScript garbage collector entirely, maintaining a rock-solid 60 FPS audio rendering loop.",
    ],
    personalizedIntro:
      "When we set out to build Sound Goose, every audio engineer told us the browser could not handle studio-grade acoustic simulation in real time. They were almost right: if you rely on standard ScriptProcessorNodes or main-thread state trees, audio buffers hitch whenever the UI recalibrates. Here is the exact pipeline we built to break through that barrier.",
    fullBody: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Sound Goose was founded to replace fragmented, offline audio production workflows with a fluid, collaborative spatial canvas. To make spatial sound feel tactile, latency must remain beneath 10 milliseconds.",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        style: "h2",
        children: [
          {
            _type: "span",
            text: "The Hidden Cost of Main-Thread Audio Scheduling",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Browsers execute DOM rendering, style recalculation, and UI handlers on a single execution thread. When an audio callback shares that loop, even a minor layout thrash causes buffer underruns, audible clicks, and phase distortion.",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        style: "h3",
        children: [
          {
            _type: "span",
            text: "Moving to Dedicated AudioWorklet Global Scopes",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "The WebAudio AudioWorklet specification provisions a synchronous, high-priority audio rendering thread that operates independently from the main JavaScript runtime. By keeping computation inside process() strictly bounded to 128 frames, underrun rates drop to zero.",
          },
        ],
        markDefs: [],
      },
    ],
    quickBites: [
      {
        title: "AudioWorklet MessagePort serialization overhead",
        testedObservation:
          "Posting Float32Array chunks across standard postMessage channels took 3.2ms per tick on mobile Safari.",
        recommendation:
          "Swap postMessage for SharedArrayBuffer with Atomics to achieve 0.1ms lock-free transfer speeds.",
        link: "https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletNode",
      },
      {
        title: "Browser sample rate mismatch penalties",
        testedObservation:
          "Requesting a 48kHz audio context on a 44.1kHz hardware interface triggers hidden browser resamplers that add 12ms of phase delay.",
        recommendation:
          "Initialize AudioContext without an explicit sampleRate, letting the hardware define the master clock, and resample source assets in workers.",
        link: "https://www.w3.org/TR/webaudio/",
      },
      {
        title: "Linear distance falloff vs. inverse-square acoustics",
        testedObservation:
          "Linear gain attenuation sounds artificial and destroys spatial depth perception in stereo headsets.",
        recommendation:
          "Adopt an inverse-distance clamped curve with a roll-off factor of 1.2 to preserve natural acoustic room presence.",
        link: "https://soundgoose.com",
      },
    ],
    actionableNextStep:
      "Open your browser console on your current audio project and inspect new AudioContext().baseLatency. If it exceeds 10ms, audit your node graph for redundant script processors.",
    canonicalCtaLabel: "Test the Sound Goose Spatial Canvas",
    canonicalCtaUrl: "/#waitlist",
    broadcastStatus: "sent",
    broadcastSentAt: new Date("2026-10-20T10:00:00.000Z").toISOString(),
  },
];

// Helper Fetchers with graceful fallbacks
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!isConfigured) {
    return FALLBACK_POSTS;
  }
  try {
    const data = await client.fetch<BlogPost[]>(postsQuery);
    return data && data.length > 0 ? data : FALLBACK_POSTS;
  } catch (err) {
    console.warn(
      "Could not fetch blog posts from Sanity, using fallback:",
      err,
    );
    return FALLBACK_POSTS;
  }
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  if (!isConfigured) {
    return FALLBACK_POSTS.find((p) => p.slug.current === slug) || null;
  }
  try {
    const post = await client.fetch<BlogPost | null>(postBySlugQuery, { slug });
    return post || FALLBACK_POSTS.find((p) => p.slug.current === slug) || null;
  } catch (err) {
    console.warn(`Could not fetch post '${slug}' from Sanity:`, err);
    return FALLBACK_POSTS.find((p) => p.slug.current === slug) || null;
  }
}

export async function getBlogPostSlugs(): Promise<string[]> {
  if (!isConfigured) {
    return FALLBACK_POSTS.map((p) => p.slug.current);
  }
  try {
    const slugs = await client.fetch<string[]>(postSlugsQuery);
    return slugs && slugs.length > 0
      ? slugs
      : FALLBACK_POSTS.map((p) => p.slug.current);
  } catch (err) {
    return FALLBACK_POSTS.map((p) => p.slug.current);
  }
}

export async function getNewsletterIssues(): Promise<NewsletterIssue[]> {
  if (!isConfigured) {
    return FALLBACK_NEWSLETTERS;
  }
  try {
    const data = await client.fetch<NewsletterIssue[]>(newslettersQuery);
    return data && data.length > 0 ? data : FALLBACK_NEWSLETTERS;
  } catch (err) {
    console.warn(
      "Could not fetch newsletters from Sanity, using fallback:",
      err,
    );
    return FALLBACK_NEWSLETTERS;
  }
}

export async function getNewsletterIssueBySlug(
  slug: string,
): Promise<NewsletterIssue | null> {
  if (!isConfigured) {
    return FALLBACK_NEWSLETTERS.find((n) => n.slug.current === slug) || null;
  }
  try {
    const issue = await client.fetch<NewsletterIssue | null>(
      newsletterBySlugQuery,
      { slug },
    );
    return (
      issue || FALLBACK_NEWSLETTERS.find((n) => n.slug.current === slug) || null
    );
  } catch (err) {
    console.warn(`Could not fetch newsletter '${slug}' from Sanity:`, err);
    return FALLBACK_NEWSLETTERS.find((n) => n.slug.current === slug) || null;
  }
}

export async function getNewsletterSlugs(): Promise<string[]> {
  if (!isConfigured) {
    return FALLBACK_NEWSLETTERS.map((n) => n.slug.current);
  }
  try {
    const slugs = await client.fetch<string[]>(newsletterSlugsQuery);
    return slugs && slugs.length > 0
      ? slugs
      : FALLBACK_NEWSLETTERS.map((n) => n.slug.current);
  } catch (err) {
    return FALLBACK_NEWSLETTERS.map((n) => n.slug.current);
  }
}

export async function getAdjacentNewsletterIssues(
  currentIssueNumber: number,
): Promise<{
  prev: NewsletterIssue | null;
  next: NewsletterIssue | null;
}> {
  const all = await getNewsletterIssues();
  const sorted = [...all].sort((a, b) => a.issueNumber - b.issueNumber);
  const currentIndex = sorted.findIndex(
    (item) => item.issueNumber === currentIssueNumber,
  );
  if (currentIndex === -1) {
    return { prev: null, next: null };
  }
  return {
    prev: currentIndex > 0 ? sorted[currentIndex - 1]! : null,
    next: currentIndex < sorted.length - 1 ? sorted[currentIndex + 1]! : null,
  };
}
