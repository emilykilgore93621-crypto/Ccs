import { Chapter, LanguageOption } from './types';

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

export const CHAPTERS: Chapter[] = [
  {
    id: 'intro-wood',
    title: 'Understanding Wood Grain',
    category: 'Foundation',
    readTime: '6 min read',
    imageUrl: 'https://picsum.photos/800/400?grayscale',
    content: `
# The Soul of the Tree

Before you ever pick up a saw, you must understand the material. Wood is not a static substance like plastic or metal; it is organic, hygroscopic, and anisotropic. It breathes, it moves, and it has a direction.

## Hardwood vs. Softwood

The terms are misleading. They don't refer to physical density, but to reproduction.
*   **Hardwoods** (Angiosperms) have broad leaves and enclosed seeds (e.g., Oak, Walnut, Maple).
*   **Softwoods** (Gymnosperms) usually have needles and cones (e.g., Pine, Cedar, Fir).

For beginners, **Pine** is forgiving and cheap. **Oak** is durable but requires sharper tools.

## Reading the Grain

Run your hand along a board. One direction feels smooth; the other feels rough and may give you splinters.
*   **With the grain:** Like petting a cat from head to tail. This is how you plane and sand.
*   **Against the grain:** Causes tear-out and rough surfaces. Avoid this.

> "Working with wood is a conversation. If you shout at it with dull tools, it will scream back."
    `
  },
  {
    id: 'tools-essential',
    title: 'The Essential Country Toolkit',
    category: 'Tools',
    readTime: '8 min read',
    imageUrl: 'https://picsum.photos/800/401?grayscale',
    content: `
# Fewer Tools, Better Skills

You do not need a shop full of power tools to build beautiful things. Our ancestors built barns with five tools. Here is your starter kit.

## 1. The Block Plane
A small, one-handed plane for trimming end grain, softening edges, and fitting joints. Keep the iron razor-sharp.

## 2. The Ryoba Saw
A Japanese-style pull saw. One side is for ripping (cutting with the grain), the other for cross-cutting (across the grain). It cuts on the pull stroke, allowing for a thinner blade and less effort.

## 3. The Combination Square
Not just for checking 90-degree angles. Use it to mark parallel lines, measure depth, and check 45-degree miters. Buy a quality one (like Starrett) or don't bother.

## 4. Chisels (1/4", 1/2", 1")
For chopping joinery and paring wood. Never use them as screwdrivers or pry bars.

## 5. A Solid Workbench
Your bench is a tool. It must be heavy and rigid. If it wiggles when you plane, you cannot work accurately.
    `
  },
  {
    id: 'build-sawhorse',
    title: 'Build 1: The Stackable Sawhorse',
    category: 'Builds',
    readTime: '15 min read',
    imageUrl: 'https://picsum.photos/800/402?grayscale',
    content: `
# The First Project

Every woodworker needs sawhorses. This design is robust, stackable, and built from standard 2x4 dimensional lumber.

## Materials List
*   (3) 2x4 x 8ft Pine studs
*   (1) Box of 2.5" wood screws
*   Wood glue

## The I-Beam Construction
The top beam is an I-beam shape for incredible strength without weight.

1.  **Cut the Beam:** Cut two 32" lengths for the top plates and one 32" length for the web.
2.  **Assembly:** Screw the top plates into the edge of the web to form an 'I'.
3.  **The Legs:** Cut four legs at 30" with a 15-degree bevel on both ends.
4.  **Attachment:** Screw the legs to the I-beam web, splaying them out for stability.

## Practical Tip
Don't worry about finish. These will get cut, painted on, and abused. They are tools, not furniture.
    `
  },
  {
    id: 'build-bench',
    title: 'Build 2: The Garden Bench',
    category: 'Builds',
    readTime: '20 min read',
    imageUrl: 'https://picsum.photos/800/403?grayscale',
    content: `
# A Place to Rest

This bench uses simple lap joints for a rustic, sturdy look suitable for any garden or porch.

## Materials
*   Cedar or White Oak (rot resistant)
*   Carriage bolts (galvanized)

## Steps overview
1.  **Cut to Length:** Measure twice, cut once.
2.  **Cut the Lap Joints:** Set your circular saw depth to half the thickness of the wood. Make multiple passes (kerfing) and clear the waste with a chisel.
3.  **Dry Fit:** Assemble without glue to check tightness.
4.  **Glue and Bolt:** Apply waterproof glue (Type III) and tighten the carriage bolts.

> "A bench that wobbles is just a pile of wood waiting to fall down."
    `
  }
];