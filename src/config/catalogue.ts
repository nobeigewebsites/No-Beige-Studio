
import type {
  AssetCategory,
  CatalogueCategoryDefinition,
  HistoricalPeriod,
  DesignStyle,
  MaterialFamily,
  ColourFamily,
  SurfaceFinish,
  AssetCondition,
} from '../types/catalogue';

/* ========================================
   NO BEIGE STUDIO
   Universal Catalogue Configuration
======================================== */

/* ========================================
   CATEGORIES AND SUBCATEGORIES
======================================== */

export const CATALOGUE_CATEGORIES:
  CatalogueCategoryDefinition[] = [
    {
      id: 'architecture',
      name: 'Architectural Elements',
      description:
        'Architectural features from ancient buildings to contemporary designs.',
      icon: 'Landmark',
      colour: '#00d5e8',
      compatibleStudios: [
        'architecture',
        'restoration',
        'interior',
        'creator',
      ],
      sortOrder: 1,
      subcategories: [
        'Columns',
        'Pillars',
        'Arches',
        'Archways',
        'Domes',
        'Vaulted Ceilings',
        'Cornices',
        'Coving',
        'Ceiling Roses',
        'Pilasters',
        'Balustrades',
        'Staircases',
        'Handrails',
        'Fireplaces',
        'Chimneys',
        'Mantelpieces',
        'Bay Windows',
        'Balconies',
        'Porches',
        'Verandas',
        'Turrets',
        'Towers',
        'Decorative Facades',
        'Architectural Mouldings',
        'Stone Carvings',
        'Decorative Plasterwork',
        'Pergolas',
        'Canopies',
        'Other Architectural Elements',
      ],
    },

    {
      id: 'structural',
      name: 'Structural Elements',
      description:
        'Building components and structural design representations.',
      icon: 'Construction',
      colour: '#00d5e8',
      compatibleStudios: [
        'architecture',
        'restoration',
        'landscape',
      ],
      sortOrder: 2,
      subcategories: [
        'Foundations',
        'External Walls',
        'Internal Walls',
        'Partition Walls',
        'Retaining Walls',
        'Timber Frames',
        'Steel Frames',
        'Beams',
        'Joists',
        'Lintels',
        'Roof Trusses',
        'Roof Rafters',
        'Roof Structures',
        'Roof Tiles',
        'Roof Coverings',
        'Floor Structures',
        'Concrete Slabs',
        'Insulation',
        'Cladding',
        'Structural Supports',
        'Drainage Components',
        'Guttering',
        'Other Structural Elements',
      ],
    },

    {
      id: 'furniture',
      name: 'Furniture',
      description:
        'Furniture from every era, style and creative tradition.',
      icon: 'Armchair',
      colour: '#ff9b36',
      compatibleStudios: [
        'interior',
        'restoration',
        'architecture',
        'creator',
      ],
      sortOrder: 3,
      subcategories: [
        'Sofas',
        'Corner Sofas',
        'Modular Sofas',
        'Sofa Beds',
        'Chaise Longues',
        'Armchairs',
        'Accent Chairs',
        'Dining Chairs',
        'Rocking Chairs',
        'Recliners',
        'Stools',
        'Ottomans',
        'Benches',
        'Dining Tables',
        'Coffee Tables',
        'Side Tables',
        'Console Tables',
        'Nesting Tables',
        'Writing Desks',
        'Office Desks',
        'Dressing Tables',
        'Beds',
        'Headboards',
        'Bedside Tables',
        'Wardrobes',
        'Chest of Drawers',
        'Dressers',
        'Sideboards',
        'Display Cabinets',
        'Bookcases',
        'Shelving Units',
        'Storage Units',
        'Trunks and Chests',
        'Room Dividers',
        'Media Units',
        'Bar Furniture',
        'Children’s Furniture',
        'Nursery Furniture',
        'Office Furniture',
        'Commercial Furniture',
        'Bespoke Furniture',
        'Other Furniture',
      ],
    },

    {
      id: 'lighting',
      name: 'Lighting',
      description:
        'Decorative, practical and architectural lighting.',
      icon: 'Lightbulb',
      colour: '#ffd166',
      compatibleStudios: [
        'architecture',
        'interior',
        'restoration',
        'landscape',
        'creator',
      ],
      sortOrder: 4,
      subcategories: [
        'Chandeliers',
        'Pendant Lights',
        'Ceiling Lights',
        'Flush Mount Lights',
        'Wall Lights',
        'Wall Sconces',
        'Table Lamps',
        'Floor Lamps',
        'Desk Lamps',
        'Reading Lights',
        'Spotlights',
        'Track Lighting',
        'Recessed Lighting',
        'LED Strips',
        'Neon Lighting',
        'Lanterns',
        'Candle Holders',
        'Oil Lamps',
        'Historical Lighting',
        'Outdoor Lighting',
        'Garden Lighting',
        'Pathway Lighting',
        'Security Lighting',
        'Decorative Lighting',
        'Smart Lighting',
        'Other Lighting',
      ],
    },

    {
      id: 'decor',
      name: 'Decorative Objects',
      description:
        'The details that give every space its personality.',
      icon: 'Palette',
      colour: '#ff3d8d',
      compatibleStudios: [
        'interior',
        'restoration',
        'landscape',
        'creator',
      ],
      sortOrder: 5,
      subcategories: [
        'Mirrors',
        'Wall Art',
        'Paintings',
        'Prints',
        'Photographs',
        'Picture Frames',
        'Sculptures',
        'Statues',
        'Figurines',
        'Vases',
        'Decorative Bowls',
        'Ceramics',
        'Glassware',
        'Clocks',
        'Globes',
        'Books',
        'Bookends',
        'Candles',
        'Decorative Trays',
        'Baskets',
        'Decorative Boxes',
        'Collectables',
        'Ornaments',
        'Seasonal Decorations',
        'Cultural Decorative Objects',
        'Other Decorative Objects',
      ],
    },

    {
      id: 'materials',
      name: 'Materials and Textures',
      description:
        'Surface materials, finishes and customisable textures.',
      icon: 'Layers3',
      colour: '#b18aff',
      compatibleStudios: [
        'architecture',
        'interior',
        'restoration',
        'landscape',
        'creator',
      ],
      sortOrder: 6,
      subcategories: [
        'Solid Wood',
        'Wood Veneers',
        'Engineered Wood',
        'Natural Stone',
        'Marble',
        'Granite',
        'Slate',
        'Limestone',
        'Sandstone',
        'Brick',
        'Concrete',
        'Cement',
        'Plaster',
        'Lime Plaster',
        'Clay',
        'Ceramic',
        'Porcelain',
        'Terracotta',
        'Glass',
        'Stained Glass',
        'Steel',
        'Iron',
        'Copper',
        'Brass',
        'Bronze',
        'Aluminium',
        'Leather',
        'Fabrics',
        'Bamboo',
        'Rattan',
        'Cork',
        'Resin',
        'Plastics',
        'Composite Materials',
        'Recycled Materials',
        'Reclaimed Materials',
        'Natural Materials',
        'Custom Textures',
        'Other Materials',
      ],
    },

    {
      id: 'flooring',
      name: 'Flooring',
      description:
        'Floor finishes for historical, contemporary and experimental spaces.',
      icon: 'Grid3X3',
      colour: '#ff9b36',
      compatibleStudios: [
        'architecture',
        'interior',
        'restoration',
        'creator',
      ],
      sortOrder: 7,
      subcategories: [
        'Solid Hardwood',
        'Engineered Wood',
        'Parquet',
        'Herringbone',
        'Chevron',
        'Reclaimed Floorboards',
        'Laminate',
        'Vinyl',
        'Luxury Vinyl Tiles',
        'Linoleum',
        'Ceramic Tiles',
        'Porcelain Tiles',
        'Mosaic Tiles',
        'Victorian Tiles',
        'Encaustic Tiles',
        'Terracotta Tiles',
        'Natural Stone Flooring',
        'Marble Flooring',
        'Slate Flooring',
        'Flagstones',
        'Polished Concrete',
        'Terrazzo',
        'Epoxy Flooring',
        'Cork Flooring',
        'Bamboo Flooring',
        'Carpet',
        'Carpet Tiles',
        'Rubber Flooring',
        'Accessible Flooring',
        'Other Flooring',
      ],
    },

    {
      id: 'wall-coverings',
      name: 'Walls and Wall Coverings',
      description:
        'Paints, wallpapers, panelling and decorative wall treatments.',
      icon: 'PaintRoller',
      colour: '#ff3d8d',
      compatibleStudios: [
        'architecture',
        'interior',
        'restoration',
        'creator',
      ],
      sortOrder: 8,
      subcategories: [
        'Paint Colours',
        'Matte Paint',
        'Satin Paint',
        'Gloss Paint',
        'Chalk Paint',
        'Limewash',
        'Mineral Paint',
        'Metallic Paint',
        'Textured Paint',
        'Wallpaper',
        'Historical Wallpaper',
        'Floral Wallpaper',
        'Geometric Wallpaper',
        'Murals',
        'Wood Panelling',
        'Wainscoting',
        'Wall Slats',
        'Acoustic Panels',
        'Brick Effect',
        'Exposed Brick',
        'Stone Cladding',
        'Wall Tiles',
        'Mosaic Walls',
        'Decorative Plaster',
        'Venetian Plaster',
        'Fabric Wall Coverings',
        'Living Walls',
        'Custom Wall Finishes',
        'Other Wall Coverings',
      ],
    },

    {
      id: 'ceiling-finishes',
      name: 'Ceilings',
      description:
        'Ceiling materials, decorative features and finishes.',
      icon: 'Layers',
      colour: '#b18aff',
      compatibleStudios: [
        'architecture',
        'interior',
        'restoration',
        'creator',
      ],
      sortOrder: 9,
      subcategories: [
        'Painted Ceilings',
        'Plastered Ceilings',
        'Exposed Beams',
        'Timber Ceilings',
        'Coffered Ceilings',
        'Decorative Ceilings',
        'Ceiling Tiles',
        'Suspended Ceilings',
        'Acoustic Ceilings',
        'Metal Ceilings',
        'Tin Ceilings',
        'Stretch Ceilings',
        'Ceiling Murals',
        'Historical Ceilings',
        'Other Ceiling Finishes',
      ],
    },

    {
      id: 'doors',
      name: 'Doors',
      description:
        'Internal, external, historical and specialist doors.',
      icon: 'DoorOpen',
      colour: '#00d5e8',
      compatibleStudios: [
        'architecture',
        'interior',
        'restoration',
        'creator',
      ],
      sortOrder: 10,
      subcategories: [
        'Front Doors',
        'Back Doors',
        'Internal Doors',
        'Panelled Doors',
        'Flush Doors',
        'French Doors',
        'Patio Doors',
        'Sliding Doors',
        'Bi-fold Doors',
        'Pocket Doors',
        'Barn Doors',
        'Stable Doors',
        'Arched Doors',
        'Double Doors',
        'Glazed Doors',
        'Stained Glass Doors',
        'Historical Doors',
        'Reclaimed Doors',
        'Garage Doors',
        'Fire Doors',
        'Accessible Doors',
        'Commercial Doors',
        'Custom Doors',
        'Other Doors',
      ],
    },

    {
      id: 'windows',
      name: 'Windows',
      description:
        'Window styles, frames and glazing from different periods.',
      icon: 'AppWindow',
      colour: '#00d5e8',
      compatibleStudios: [
        'architecture',
        'interior',
        'restoration',
        'creator',
      ],
      sortOrder: 11,
      subcategories: [
        'Casement Windows',
        'Sash Windows',
        'Bay Windows',
        'Bow Windows',
        'Fixed Windows',
        'Picture Windows',
        'Sliding Windows',
        'Tilt and Turn Windows',
        'Awning Windows',
        'Dormer Windows',
        'Roof Windows',
        'Skylights',
        'Roof Lanterns',
        'Arched Windows',
        'Round Windows',
        'Gothic Windows',
        'Leadlight Windows',
        'Stained Glass Windows',
        'Georgian Windows',
        'Victorian Windows',
        'Crittall Style Windows',
        'Timber Windows',
        'Aluminium Windows',
        'uPVC Windows',
        'Reclaimed Windows',
        'Custom Windows',
        'Other Windows',
      ],
    },

    {
      id: 'kitchens',
      name: 'Kitchens',
      description:
        'Kitchen units, surfaces, fittings and complete design components.',
      icon: 'CookingPot',
      colour: '#ff9b36',
      compatibleStudios: [
        'architecture',
        'interior',
        'restoration',
        'creator',
      ],
      sortOrder: 12,
      subcategories: [
        'Base Units',
        'Wall Units',
        'Tall Units',
        'Corner Units',
        'Kitchen Islands',
        'Breakfast Bars',
        'Pantries',
        'Larders',
        'Freestanding Kitchens',
        'Kitchen Cabinet Doors',
        'Kitchen Worktops',
        'Kitchen Splashbacks',
        'Kitchen Sinks',
        'Kitchen Taps',
        'Kitchen Shelving',
        'Kitchen Storage',
        'Kitchen Handles',
        'Kitchen Accessories',
        'Historical Kitchens',
        'Accessible Kitchens',
        'Commercial Kitchens',
        'Outdoor Kitchens',
        'Other Kitchen Elements',
      ],
    },

    {
      id: 'bathrooms',
      name: 'Bathrooms',
      description:
        'Bathroom furniture, sanitaryware and accessible fittings.',
      icon: 'Bath',
      colour: '#00d5e8',
      compatibleStudios: [
        'architecture',
        'interior',
        'restoration',
        'creator',
      ],
      sortOrder: 13,
      subcategories: [
        'Freestanding Baths',
        'Built-in Baths',
        'Clawfoot Baths',
        'Corner Baths',
        'Walk-in Baths',
        'Shower Enclosures',
        'Walk-in Showers',
        'Wet Rooms',
        'Shower Trays',
        'Shower Screens',
        'Shower Fittings',
        'Toilets',
        'Bidets',
        'Wash Basins',
        'Pedestal Basins',
        'Countertop Basins',
        'Vanity Units',
        'Bathroom Cabinets',
        'Bathroom Mirrors',
        'Bathroom Taps',
        'Towel Rails',
        'Bathroom Storage',
        'Bathroom Accessories',
        'Accessible Sanitaryware',
        'Historical Bathrooms',
        'Other Bathroom Elements',
      ],
    },

    {
      id: 'appliances',
      name: 'Appliances',
      description:
        'Household, commercial and historical appliance representations.',
      icon: 'Refrigerator',
      colour: '#8b9bb4',
      compatibleStudios: [
        'architecture',
        'interior',
        'restoration',
        'creator',
      ],
      sortOrder: 14,
      subcategories: [
        'Refrigerators',
        'Freezers',
        'Fridge Freezers',
        'Ovens',
        'Hobs',
        'Range Cookers',
        'Microwaves',
        'Extractor Hoods',
        'Dishwashers',
        'Washing Machines',
        'Tumble Dryers',
        'Coffee Machines',
        'Kettles',
        'Toasters',
        'Small Appliances',
        'Televisions',
        'Audio Equipment',
        'Computers',
        'Heating Appliances',
        'Cooling Appliances',
        'Historical Appliances',
        'Commercial Appliances',
        'Other Appliances',
      ],
    },

    {
      id: 'textiles',
      name: 'Textiles and Soft Furnishings',
      description:
        'Fabrics, upholstery and decorative soft furnishings.',
      icon: 'Shirt',
      colour: '#ff3d8d',
      compatibleStudios: [
        'interior',
        'restoration',
        'creator',
      ],
      sortOrder: 15,
      subcategories: [
        'Curtains',
        'Drapes',
        'Roman Blinds',
        'Roller Blinds',
        'Venetian Blinds',
        'Vertical Blinds',
        'Shutters',
        'Cushions',
        'Throws',
        'Blankets',
        'Rugs',
        'Runners',
        'Tapestries',
        'Bedding',
        'Bedspreads',
        'Tablecloths',
        'Upholstery Fabrics',
        'Velvet',
        'Silk',
        'Cotton',
        'Linen',
        'Wool',
        'Leather',
        'Lace',
        'Historical Textiles',
        'Outdoor Fabrics',
        'Custom Fabric Patterns',
        'Other Textiles',
      ],
    },

    {
      id: 'hardware',
      name: 'Hardware and Fittings',
      description:
        'Practical and decorative fittings for buildings and furniture.',
      icon: 'Wrench',
      colour: '#8b9bb4',
      compatibleStudios: [
        'architecture',
        'interior',
        'restoration',
        'landscape',
        'creator',
      ],
      sortOrder: 16,
      subcategories: [
        'Door Handles',
        'Door Knobs',
        'Cabinet Handles',
        'Drawer Pulls',
        'Hinges',
        'Locks',
        'Latches',
        'Door Knockers',
        'Letter Plates',
        'Escutcheons',
        'Window Handles',
        'Window Fasteners',
        'Furniture Legs',
        'Furniture Castors',
        'Decorative Brackets',
        'Shelf Supports',
        'Hooks',
        'Rails',
        'Fixings',
        'Historical Hardware',
        'Reclaimed Hardware',
        'Custom Hardware',
        'Other Hardware',
      ],
    },

    {
      id: 'antiques',
      name: 'Antiques and Collectables',
      description:
        'Historical objects and antique-inspired digital assets.',
      icon: 'Hourglass',
      colour: '#b18aff',
      compatibleStudios: [
        'restoration',
        'interior',
        'architecture',
        'creator',
      ],
      sortOrder: 17,
      subcategories: [
        'Antique Chairs',
        'Antique Tables',
        'Antique Cabinets',
        'Antique Beds',
        'Antique Desks',
        'Antique Chests',
        'Antique Mirrors',
        'Antique Clocks',
        'Antique Lighting',
        'Antique Ceramics',
        'Antique Glassware',
        'Antique Silverware',
        'Antique Textiles',
        'Antique Paintings',
        'Antique Sculptures',
        'Historical Instruments',
        'Historical Books',
        'Historical Household Objects',
        'Vintage Collectables',
        'Decorative Antiques',
        'Other Antiques',
      ],
    },

    {
      id: 'salvage',
      name: 'Salvage and Reclaimed',
      description:
        'Reclaimed building materials, damaged furniture and restoration opportunities.',
      icon: 'Recycle',
      colour: '#a9e52c',
      compatibleStudios: [
        'restoration',
        'architecture',
        'interior',
        'landscape',
        'creator',
      ],
      sortOrder: 18,
      subcategories: [
        'Reclaimed Timber',
        'Reclaimed Beams',
        'Reclaimed Floorboards',
        'Reclaimed Bricks',
        'Reclaimed Stone',
        'Reclaimed Tiles',
        'Reclaimed Roofing',
        'Reclaimed Doors',
        'Reclaimed Windows',
        'Reclaimed Fireplaces',
        'Reclaimed Metalwork',
        'Reclaimed Ironwork',
        'Reclaimed Sanitaryware',
        'Salvaged Furniture',
        'Damaged Furniture',
        'Unfinished Furniture',
        'Restoration Projects',
        'Architectural Salvage',
        'Industrial Salvage',
        'Garden Salvage',
        'Upcycled Objects',
        'Other Salvage',
      ],
    },

    {
      id: 'heritage',
      name: 'Historical and Heritage',
      description:
        'Historical building features, traditional craftsmanship and cultural design references.',
      icon: 'Castle',
      colour: '#b18aff',
      compatibleStudios: [
        'architecture',
        'restoration',
        'interior',
        'landscape',
        'creator',
      ],
      sortOrder: 19,
      subcategories: [
        'Ancient Architectural Features',
        'Classical Architecture',
        'Medieval Architecture',
        'Gothic Architecture',
        'Renaissance Architecture',
        'Tudor Architecture',
        'Jacobean Architecture',
        'Georgian Architecture',
        'Victorian Architecture',
        'Edwardian Architecture',
        'Traditional Cottages',
        'Historic Farmhouses',
        'Historic Manor Houses',
        'Historic Commercial Buildings',
        'Traditional Timber Framing',
        'Traditional Stonework',
        'Traditional Plasterwork',
        'Traditional Joinery',
        'Traditional Metalwork',
        'Historical Decorative Motifs',
        'Historical Reproductions',
        'Cultural Architecture',
        'Conservation Materials',
        'Other Heritage Elements',
      ],
    },

    {
      id: 'plants',
      name: 'Plants and Flowers',
      description:
        'Indoor and outdoor planting for realistic landscape and interior design.',
      icon: 'Flower2',
      colour: '#a9e52c',
      compatibleStudios: [
        'landscape',
        'interior',
        'architecture',
        'creator',
      ],
      sortOrder: 20,
      subcategories: [
        'Annual Flowers',
        'Biennial Plants',
        'Perennial Flowers',
        'Flowering Shrubs',
        'Evergreen Shrubs',
        'Deciduous Shrubs',
        'Climbing Plants',
        'Ground Cover Plants',
        'Ornamental Grasses',
        'Ferns',
        'Succulents',
        'Cacti',
        'Indoor Plants',
        'Tropical Plants',
        'Mediterranean Plants',
        'Aquatic Plants',
        'Bog Plants',
        'Alpine Plants',
        'Wildflowers',
        'Herbs',
        'Vegetable Plants',
        'Fruit Plants',
        'Pollinator Plants',
        'Native Plants',
        'Drought Tolerant Plants',
        'Shade Loving Plants',
        'Hedging Plants',
        'Other Plants',
      ],
    },

    {
      id: 'trees',
      name: 'Trees',
      description:
        'Trees of different sizes, species and seasonal appearances.',
      icon: 'Trees',
      colour: '#a9e52c',
      compatibleStudios: [
        'landscape',
        'architecture',
        'creator',
      ],
      sortOrder: 21,
      subcategories: [
        'Deciduous Trees',
        'Evergreen Trees',
        'Conifers',
        'Flowering Trees',
        'Fruit Trees',
        'Nut Trees',
        'Ornamental Trees',
        'Native Trees',
        'Tropical Trees',
        'Palm Trees',
        'Mediterranean Trees',
        'Small Garden Trees',
        'Large Landscape Trees',
        'Ancient Trees',
        'Specimen Trees',
        'Bonsai Trees',
        'Other Trees',
      ],
    },

    {
      id: 'landscape',
      name: 'Landscape and Garden',
      description:
        'Hard landscaping, garden structures and outdoor design elements.',
      icon: 'Mountain',
      colour: '#a9e52c',
      compatibleStudios: [
        'landscape',
        'architecture',
        'restoration',
        'creator',
      ],
      sortOrder: 22,
      subcategories: [
        'Paving',
        'Patios',
        'Garden Paths',
        'Decking',
        'Gravel',
        'Aggregates',
        'Garden Walls',
        'Retaining Walls',
        'Fencing',
        'Garden Gates',
        'Trellises',
        'Pergolas',
        'Gazebos',
        'Arbours',
        'Greenhouses',
        'Garden Sheds',
        'Summerhouses',
        'Garden Rooms',
        'Raised Beds',
        'Planters',
        'Plant Pots',
        'Lawn Surfaces',
        'Artificial Grass',
        'Soil Surfaces',
        'Mulch',
        'Rock Gardens',
        'Garden Sculptures',
        'Stepping Stones',
        'Outdoor Steps',
        'Play Areas',
        'Wildlife Habitats',
        'Bird Houses',
        'Insect Hotels',
        'Accessible Garden Features',
        'Other Landscape Elements',
      ],
    },

    {
      id: 'outdoor-furniture',
      name: 'Outdoor Furniture',
      description:
        'Furniture and accessories designed for exterior spaces.',
      icon: 'Umbrella',
      colour: '#a9e52c',
      compatibleStudios: [
        'landscape',
        'architecture',
        'restoration',
        'creator',
      ],
      sortOrder: 23,
      subcategories: [
        'Garden Chairs',
        'Garden Tables',
        'Garden Benches',
        'Outdoor Sofas',
        'Outdoor Dining Sets',
        'Sun Loungers',
        'Hammocks',
        'Swing Seats',
        'Outdoor Daybeds',
        'Outdoor Stools',
        'Picnic Tables',
        'Parasols',
        'Outdoor Storage',
        'Outdoor Bars',
        'Fire Pits',
        'Outdoor Fireplaces',
        'Barbecues',
        'Outdoor Cushions',
        'Historical Garden Furniture',
        'Other Outdoor Furniture',
      ],
    },

    {
      id: 'water-features',
      name: 'Water Features',
      description:
        'Decorative and functional water elements for landscape design.',
      icon: 'Waves',
      colour: '#00d5e8',
      compatibleStudios: [
        'landscape',
        'architecture',
        'restoration',
        'creator',
      ],
      sortOrder: 24,
      subcategories: [
        'Garden Ponds',
        'Wildlife Ponds',
        'Koi Ponds',
        'Natural Swimming Ponds',
        'Swimming Pools',
        'Infinity Pools',
        'Fountains',
        'Wall Fountains',
        'Waterfalls',
        'Streams',
        'Reflecting Pools',
        'Water Bowls',
        'Water Walls',
        'Bird Baths',
        'Historical Fountains',
        'Aquatic Structures',
        'Other Water Features',
      ],
    },

    {
      id: 'accessibility',
      name: 'Accessible Living',
      description:
        'Inclusive design elements supporting independent living and different access needs.',
      icon: 'Accessibility',
      colour: '#00d5e8',
      compatibleStudios: [
        'architecture',
        'interior',
        'restoration',
        'landscape',
        'creator',
      ],
      sortOrder: 25,
      subcategories: [
        'Wheelchair Ramps',
        'Threshold Ramps',
        'Grab Rails',
        'Support Rails',
        'Accessible Doorways',
        'Automatic Doors',
        'Accessible Kitchens',
        'Adjustable Worktops',
        'Accessible Storage',
        'Accessible Bathrooms',
        'Accessible Toilets',
        'Accessible Showers',
        'Shower Seats',
        'Transfer Benches',
        'Adjustable Furniture',
        'Accessible Seating',
        'Accessible Beds',
        'Stairlifts',
        'Platform Lifts',
        'Residential Lifts',
        'Ceiling Hoist Representations',
        'Low Reach Controls',
        'Tactile Surfaces',
        'High Contrast Features',
        'Sensory Friendly Features',
        'Accessible Garden Paths',
        'Accessible Raised Beds',
        'Accessible Outdoor Seating',
        'Other Accessibility Elements',
      ],
    },

    {
      id: 'utilities',
      name: 'Building Services and Utilities',
      description:
        'Visual planning components for building services and installations.',
      icon: 'PlugZap',
      colour: '#ff9b36',
      compatibleStudios: [
        'architecture',
        'interior',
        'restoration',
        'landscape',
      ],
      sortOrder: 26,
      subcategories: [
        'Electrical Sockets',
        'Electrical Switches',
        'Consumer Units',
        'Electrical Routing Symbols',
        'Lighting Controls',
        'Smart Home Controls',
        'Radiators',
        'Boilers',
        'Heat Pumps',
        'Underfloor Heating Symbols',
        'Air Conditioning Units',
        'Ventilation Grilles',
        'Extractor Fans',
        'Plumbing Fixtures',
        'Pipework Symbols',
        'Water Tanks',
        'Drainage Symbols',
        'Solar Panels',
        'Battery Storage',
        'EV Charging Points',
        'Smoke Alarms',
        'Carbon Monoxide Alarms',
        'Security Systems',
        'Rainwater Collection',
        'Irrigation Systems',
        'Other Utility Components',
      ],
    },

    {
      id: 'custom',
      name: 'Custom Creations',
      description:
        'Original objects, imported assets and personalised designs.',
      icon: 'Sparkles',
      colour: '#ff3d8d',
      compatibleStudios: [
        'architecture',
        'interior',
        'restoration',
        'landscape',
        'creator',
      ],
      sortOrder: 27,
      subcategories: [
        'Custom Furniture',
        'Custom Architecture',
        'Custom Lighting',
        'Custom Decorations',
        'Custom Materials',
        'Custom Textures',
        'Custom Fabric Patterns',
        'Custom Hardware',
        'Custom Landscape Objects',
        'Custom Historical Objects',
        'Custom Sculptures',
        'Imported 3D Models',
        'Imported 2D Symbols',
        'User Uploaded Images',
        'Procedural Objects',
        'Experimental Creations',
        'Other Custom Creations',
      ],
    },

    {
      id: 'other',
      name: 'Other Design Assets',
      description:
        'Additional design resources and specialist objects.',
      icon: 'Shapes',
      colour: '#8b9bb4',
      compatibleStudios: [
        'architecture',
        'interior',
        'restoration',
        'landscape',
        'creator',
      ],
      sortOrder: 28,
      subcategories: [
        'People and Scale Figures',
        'Animal Representations',
        'Vehicles',
        'Commercial Objects',
        'Retail Displays',
        'Hospitality Objects',
        'Educational Objects',
        'Event Design Objects',
        'Sports and Recreation',
        'Technical Symbols',
        'Reference Objects',
        'Unclassified Assets',
      ],
    },
  ];

/* ========================================
   CATEGORY LOOKUP
======================================== */

export const CATALOGUE_CATEGORY_MAP =
  Object.fromEntries(
    CATALOGUE_CATEGORIES.map(
      (category) => [
        category.id,
        category,
      ]
    )
  ) as Record<
    AssetCategory,
    CatalogueCategoryDefinition
  >;

export function getCatalogueCategory(
  categoryId: AssetCategory
): CatalogueCategoryDefinition {
  return CATALOGUE_CATEGORY_MAP[categoryId];
}

export function getCatalogueSubcategories(
  categoryId: AssetCategory
): string[] {
  return [
    ...getCatalogueCategory(categoryId)
      .subcategories,
  ];
}

/* ========================================
   HISTORICAL PERIOD LABELS
======================================== */

export const HISTORICAL_PERIOD_LABELS:
  Record<HistoricalPeriod, string> = {
    prehistoric: 'Prehistoric',
    'ancient-egyptian': 'Ancient Egyptian',
    'ancient-greek': 'Ancient Greek',
    'ancient-roman': 'Ancient Roman',
    'ancient-asian': 'Ancient Asian',
    byzantine: 'Byzantine',
    medieval: 'Medieval',
    gothic: 'Gothic',
    renaissance: 'Renaissance',
    tudor: 'Tudor',
    elizabethan: 'Elizabethan',
    jacobean: 'Jacobean',
    baroque: 'Baroque',
    rococo: 'Rococo',
    georgian: 'Georgian',
    regency: 'Regency',
    victorian: 'Victorian',
    edwardian: 'Edwardian',
    'arts-and-crafts': 'Arts and Crafts',
    'art-nouveau': 'Art Nouveau',
    'art-deco': 'Art Deco',
    bauhaus: 'Bauhaus',
    'mid-century': 'Mid-Century',
    '1920s': '1920s',
    '1930s': '1930s',
    '1940s': '1940s',
    '1950s': '1950s',
    '1960s': '1960s',
    '1970s': '1970s',
    '1980s': '1980s',
    '1990s': '1990s',
    '2000s': '2000s',
    '2010s': '2010s',
    '2020s': '2020s',
    contemporary: 'Contemporary',
    futuristic: 'Futuristic',
    timeless: 'Timeless',
    unknown: 'Unknown Period',
  };

/* ========================================
   DESIGN STYLE LABELS
======================================== */

export const DESIGN_STYLE_LABELS:
  Record<DesignStyle, string> = {
    traditional: 'Traditional',
    classical: 'Classical',
    modern: 'Modern',
    contemporary: 'Contemporary',
    minimalist: 'Minimalist',
    maximalist: 'Maximalist',
    industrial: 'Industrial',
    rustic: 'Rustic',
    country: 'Country',
    cottagecore: 'Cottagecore',
    farmhouse: 'Farmhouse',
    bohemian: 'Bohemian',
    eclectic: 'Eclectic',
    scandinavian: 'Scandinavian',
    japandi: 'Japandi',
    mediterranean: 'Mediterranean',
    tuscan: 'Tuscan',
    moroccan: 'Moroccan',
    'african-inspired': 'African-Inspired',
    'asian-inspired': 'Asian-Inspired',
    coastal: 'Coastal',
    tropical: 'Tropical',
    gothic: 'Gothic',
    victorian: 'Victorian',
    georgian: 'Georgian',
    'art-deco': 'Art Deco',
    'art-nouveau': 'Art Nouveau',
    'mid-century-modern': 'Mid-Century Modern',
    retro: 'Retro',
    vintage: 'Vintage',
    'shabby-chic': 'Shabby Chic',
    brutalist: 'Brutalist',
    organic: 'Organic',
    biophilic: 'Biophilic',
    luxury: 'Luxury',
    steampunk: 'Steampunk',
    cyberpunk: 'Cyberpunk',
    futuristic: 'Futuristic',
    fantasy: 'Fantasy',
    experimental: 'Experimental',
    custom: 'Custom',
  };

/* ========================================
   MATERIAL LABELS
======================================== */

export const MATERIAL_FAMILY_LABELS:
  Record<MaterialFamily, string> = {
    wood: 'Wood',
    'engineered-wood': 'Engineered Wood',
    stone: 'Stone',
    marble: 'Marble',
    granite: 'Granite',
    slate: 'Slate',
    brick: 'Brick',
    concrete: 'Concrete',
    cement: 'Cement',
    plaster: 'Plaster',
    lime: 'Lime',
    clay: 'Clay',
    ceramic: 'Ceramic',
    porcelain: 'Porcelain',
    glass: 'Glass',
    metal: 'Metal',
    steel: 'Steel',
    iron: 'Iron',
    copper: 'Copper',
    brass: 'Brass',
    bronze: 'Bronze',
    aluminium: 'Aluminium',
    fabric: 'Fabric',
    leather: 'Leather',
    wool: 'Wool',
    cotton: 'Cotton',
    linen: 'Linen',
    silk: 'Silk',
    velvet: 'Velvet',
    bamboo: 'Bamboo',
    rattan: 'Rattan',
    cork: 'Cork',
    rubber: 'Rubber',
    plastic: 'Plastic',
    resin: 'Resin',
    composite: 'Composite',
    paper: 'Paper',
    paint: 'Paint',
    wallpaper: 'Wallpaper',
    soil: 'Soil',
    sand: 'Sand',
    gravel: 'Gravel',
    organic: 'Organic',
    recycled: 'Recycled',
    reclaimed: 'Reclaimed',
    mixed: 'Mixed Materials',
    custom: 'Custom Material',
  };

/* ========================================
   COLOUR PALETTE
======================================== */

export const COLOUR_FAMILY_OPTIONS: {
  id: ColourFamily;
  name: string;
  hex: string;
}[] = [
  {
    id: 'black',
    name: 'Black',
    hex: '#171717',
  },
  {
    id: 'white',
    name: 'White',
    hex: '#ffffff',
  },
  {
    id: 'grey',
    name: 'Grey',
    hex: '#808080',
  },
  {
    id: 'cream',
    name: 'Cream',
    hex: '#fff4d8',
  },
  {
    id: 'beige',
    name: 'Beige',
    hex: '#d6c4a5',
  },
  {
    id: 'brown',
    name: 'Brown',
    hex: '#795548',
  },
  {
    id: 'red',
    name: 'Red',
    hex: '#e53935',
  },
  {
    id: 'orange',
    name: 'Orange',
    hex: '#ff8c32',
  },
  {
    id: 'yellow',
    name: 'Yellow',
    hex: '#ffd54f',
  },
  {
    id: 'green',
    name: 'Green',
    hex: '#43a047',
  },
  {
    id: 'blue',
    name: 'Blue',
    hex: '#2979ff',
  },
  {
    id: 'cyan',
    name: 'Cyan',
    hex: '#00d5e8',
  },
  {
    id: 'purple',
    name: 'Purple',
    hex: '#9146ff',
  },
  {
    id: 'pink',
    name: 'Pink',
    hex: '#ff3d8d',
  },
  {
    id: 'gold',
    name: 'Gold',
    hex: '#d4af37',
  },
  {
    id: 'silver',
    name: 'Silver',
    hex: '#c0c0c0',
  },
  {
    id: 'copper',
    name: 'Copper',
    hex: '#b87333',
  },
  {
    id: 'multicolour',
    name: 'Multicolour',
    hex: '#ff69b4',
  },
  {
    id: 'transparent',
    name: 'Transparent',
    hex: '#dceef5',
  },
  {
    id: 'natural',
    name: 'Natural',
    hex: '#9b805e',
  },
  {
    id: 'custom',
    name: 'Custom Colour',
    hex: '#b18aff',
  },
];

/* ========================================
   SURFACE FINISH LABELS
======================================== */

export const SURFACE_FINISH_LABELS:
  Record<SurfaceFinish, string> = {
    natural: 'Natural',
    unfinished: 'Unfinished',
    matte: 'Matte',
    satin: 'Satin',
    silk: 'Silk',
    gloss: 'Gloss',
    'high-gloss': 'High Gloss',
    polished: 'Polished',
    brushed: 'Brushed',
    hammered: 'Hammered',
    textured: 'Textured',
    distressed: 'Distressed',
    weathered: 'Weathered',
    aged: 'Aged',
    patinated: 'Patinated',
    painted: 'Painted',
    stained: 'Stained',
    oiled: 'Oiled',
    waxed: 'Waxed',
    varnished: 'Varnished',
    lacquered: 'Lacquered',
    glazed: 'Glazed',
    unsealed: 'Unsealed',
    sealed: 'Sealed',
    custom: 'Custom Finish',
  };

/* ========================================
   CONDITION LABELS
======================================== */

export const ASSET_CONDITION_LABELS:
  Record<AssetCondition, string> = {
    new: 'New',
    'like-new': 'Like New',
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    worn: 'Worn',
    damaged: 'Damaged',
    salvaged: 'Salvaged',
    reclaimed: 'Reclaimed',
    'requires-restoration': 'Requires Restoration',
    'partially-restored': 'Partially Restored',
    'fully-restored': 'Fully Restored',
    unknown: 'Unknown Condition',
  };

/* ========================================
   CATALOGUE NAVIGATION GROUPS
======================================== */

export interface CatalogueNavigationGroup {
  id: string;
  name: string;
  colour: string;
  categories: AssetCategory[];
}

export const CATALOGUE_NAVIGATION_GROUPS:
  CatalogueNavigationGroup[] = [
    {
      id: 'build',
      name: 'Build and Architecture',
      colour: '#00d5e8',
      categories: [
        'architecture',
        'structural',
        'doors',
        'windows',
        'utilities',
      ],
    },
    {
      id: 'interior',
      name: 'Interiors and Furnishings',
      colour: '#ff9b36',
      categories: [
        'furniture',
        'lighting',
        'decor',
        'kitchens',
        'bathrooms',
        'appliances',
        'textiles',
        'hardware',
      ],
    },
    {
      id: 'surfaces',
      name: 'Materials and Finishes',
      colour: '#ff3d8d',
      categories: [
        'materials',
        'flooring',
        'wall-coverings',
        'ceiling-finishes',
      ],
    },
    {
      id: 'history',
      name: 'History and Restoration',
      colour: '#b18aff',
      categories: [
        'antiques',
        'salvage',
        'heritage',
      ],
    },
    {
      id: 'outdoors',
      name: 'Gardens and Landscapes',
      colour: '#a9e52c',
      categories: [
        'plants',
        'trees',
        'landscape',
        'outdoor-furniture',
        'water-features',
      ],
    },
    {
      id: 'inclusive',
      name: 'Accessible Living',
      colour: '#00d5e8',
      categories: [
        'accessibility',
      ],
    },
    {
      id: 'creative',
      name: 'Original and Custom Creations',
      colour: '#ff3d8d',
      categories: [
        'custom',
        'other',
      ],
    },
  ];

/* ========================================
   CATALOGUE STATISTICS
======================================== */

export const CATALOGUE_STRUCTURE = {
  categoryCount:
    CATALOGUE_CATEGORIES.length,

  subcategoryCount:
    CATALOGUE_CATEGORIES.reduce(
      (total, category) =>
        total + category.subcategories.length,
      0
    ),

  historicalPeriodCount:
    Object.keys(
      HISTORICAL_PERIOD_LABELS
    ).length,

  designStyleCount:
    Object.keys(
      DESIGN_STYLE_LABELS
    ).length,

  materialFamilyCount:
    Object.keys(
      MATERIAL_FAMILY_LABELS
    ).length,

  colourFamilyCount:
    COLOUR_FAMILY_OPTIONS.length,

  surfaceFinishCount:
    Object.keys(
      SURFACE_FINISH_LABELS
    ).length,

  navigationGroupCount:
    CATALOGUE_NAVIGATION_GROUPS.length,
};

/* ========================================
   REUSABLE FILTER OPTIONS
======================================== */

export function createLabelOptions<
  T extends string
>(
  labels: Record<T, string>
): {
  value: T;
  label: string;
}[] {
  return (
    Object.keys(labels) as T[]
  ).map((value) => ({
    value,
    label: labels[value],
  }));
}

export const HISTORICAL_PERIOD_OPTIONS =
  createLabelOptions(
    HISTORICAL_PERIOD_LABELS
  );

export const DESIGN_STYLE_OPTIONS =
  createLabelOptions(
    DESIGN_STYLE_LABELS
  );

export const MATERIAL_FAMILY_OPTIONS =
  createLabelOptions(
    MATERIAL_FAMILY_LABELS
  );

export const SURFACE_FINISH_OPTIONS =
  createLabelOptions(
    SURFACE_FINISH_LABELS
  );

export const ASSET_CONDITION_OPTIONS =
  createLabelOptions(
    ASSET_CONDITION_LABELS
  );
