
import {
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import type {
  ReactNode,
} from 'react';

import {
  X,
  Heart,
  Plus,
  Check,
  Box,
  Ruler,
  Layers3,
  History,
  Hammer,
  Leaf,
  ShieldCheck,
  Accessibility,
  Palette,
  FolderPlus,
  ExternalLink,
  Info,
} from 'lucide-react';

import type {
  CatalogueAsset,
  AssetPrice,
} from '../../types/catalogue';

import {
  useCatalogueStore,
} from '../../store/catalogueStore';

import {
  usePreferencesStore,
} from '../../store/preferencesStore';

import {
  getStudio,
} from '../../config/studios';

import AssetPreview from './AssetPreview';

/* ========================================
   NO BEIGE STUDIO
   Universal Asset Details Dialog

   Comprehensive asset information.
   Historical and technical details.
   Licensing and personal collections.
======================================== */

interface AssetDetailsDialogProps {
  asset: CatalogueAsset | null;

  open: boolean;

  onClose: () => void;

  onAdd?: (
    asset: CatalogueAsset
  ) => void;
}

type DetailTab =
  | 'overview'
  | 'technical'
  | 'heritage'
  | 'restoration'
  | 'plant'
  | 'accessibility'
  | 'sustainability'
  | 'customisation'
  | 'licensing';

/* ========================================
   DISPLAY UTILITIES
======================================== */

function formatLabel(
  value: string
): string {
  return value
    .replace(/-/g, ' ')
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    );
}

function formatBoolean(
  value?: boolean
): string {
  if (value === undefined) {
    return 'Not specified';
  }

  return value
    ? 'Yes'
    : 'No';
}

function formatPrice(
  price: AssetPrice
): string {
  let amount: string;

  try {
    amount =
      new Intl.NumberFormat(
        'en-GB',
        {
          style: 'currency',

          currency:
            price.currency,
        }
      ).format(
        price.amount
      );

  } catch {
    amount =
      `${price.currency} ${price.amount.toFixed(2)}`;
  }

  return [
    price.estimated
      ? 'Estimated'
      : '',

    amount,

    `/ ${price.unit.replace(/-/g, ' ')}`,
  ]
    .filter(Boolean)
    .join(' ');
}

function safeExternalUrl(
  value?: string
): string | null {
  if (!value) {
    return null;
  }

  try {
    const url =
      new URL(value);

    return url.protocol === 'https:'
      ? url.href
      : null;

  } catch {
    return null;
  }
}

/* ========================================
   MEASUREMENT CONVERSION

   Catalogue measurements are stored
   internally in metres.
======================================== */

function formatMeasurement(
  metres: number,

  unit: string
): string {
  const conversions:
    Record<string, number> = {
      mm: 1000,

      cm: 100,

      m: 1,

      in: 39.37007874,

      ft: 3.280839895,
    };

  const selectedUnit =
    conversions[unit] !== undefined
      ? unit
      : 'm';

  const converted =
    metres *
    conversions[selectedUnit];

  return (
    new Intl.NumberFormat(
      'en-GB',
      {
        maximumFractionDigits: 2,
      }
    ).format(converted) +
    ` ${selectedUnit}`
  );
}

/* ========================================
   REUSABLE DETAIL COMPONENTS
======================================== */

function DetailSection({
  title,

  children,
}: {
  title: string;

  children: ReactNode;
}) {
  return (
    <section className="asset-detail-section">

      <h3>
        {title}
      </h3>

      {children}

    </section>
  );
}

function DetailRow({
  label,

  value,
}: {
  label: string;

  value?: ReactNode;
}) {
  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return null;
  }

  return (
    <div className="asset-detail-row">

      <dt>
        {label}
      </dt>

      <dd>
        {value}
      </dd>

    </div>
  );
}

function DetailTags({
  values,
}: {
  values: string[];
}) {
  if (values.length === 0) {
    return (
      <span className="asset-detail-muted">
        Not specified
      </span>
    );
  }

  return (
    <div className="asset-detail-tags">

      {values.map(
        (value) => (
          <span
            key={value}
            className="asset-detail-tag"
          >
            {formatLabel(value)}
          </span>
        )
      )}

    </div>
  );
}

function DetailNotice({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="asset-detail-notice">

      <Info
        size={18}
        aria-hidden="true"
      />

      <div>
        {children}
      </div>

    </div>
  );
}

function DetailList({
  values,
}: {
  values?: string[];
}) {
  if (!values?.length) {
    return null;
  }

  return (
    <ul className="asset-detail-list">

      {values.map(
        (value, index) => (
          <li key={`${index}-${value}`}>
            {value}
          </li>
        )
      )}

    </ul>
  );
}

function ExternalReference({
  url,

  label,
}: {
  url?: string;

  label: string;
}) {
  const safeUrl =
    safeExternalUrl(url);

  if (!safeUrl) {
    return null;
  }

  return (
    <a
      className="asset-detail-reference"
      href={safeUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}

      <ExternalLink
        size={14}
        aria-hidden="true"
      />
    </a>
  );
}

/* ========================================
   OVERVIEW TAB
======================================== */

function OverviewTab({
  asset,
}: {
  asset: CatalogueAsset;
}) {
  return (
    <>

      <DetailSection title="About this asset">

        <p>
          {asset.description}
        </p>

        {!asset.verified && (
          <DetailNotice>
            This asset is a design concept
            or has not yet completed
            catalogue verification.
          </DetailNotice>
        )}

        <dl className="asset-detail-properties">

          <DetailRow
            label="Category"
            value={
              formatLabel(
                asset.category
              )
            }
          />

          <DetailRow
            label="Subcategory"
            value={
              asset.subcategory
            }
          />

          <DetailRow
            label="Source"
            value={
              formatLabel(
                asset.source
              )
            }
          />

          <DetailRow
            label="Creator"
            value={
              asset.creatorName
            }
          />

          <DetailRow
            label="Manufacturer"
            value={
              asset.manufacturerName
            }
          />

          <DetailRow
            label="Product code"
            value={
              asset.manufacturerProductCode
            }
          />

          <DetailRow
            label="Digital access"
            value={
              formatLabel(
                asset.access
              )
            }
          />

        </dl>

      </DetailSection>

      <DetailSection title="Compatible studios">

        <div className="asset-detail-studios">

          {asset.compatibleStudios.map(
            (studioId) => {
              const studio =
                getStudio(studioId);

              return (
                <span
                  key={studioId}
                  className="asset-detail-studio"
                >
                  <span
                    className="asset-detail-studio-dot"
                    style={{
                      backgroundColor:
                        studio.colour,
                    }}
                    aria-hidden="true"
                  />

                  {studio.name}

                </span>
              );
            }
          )}

        </div>

      </DetailSection>

      <DetailSection title="Design characteristics">

        <dl className="asset-detail-properties">

          <DetailRow
            label="Design styles"
            value={
              <DetailTags
                values={asset.styles}
              />
            }
          />

          <DetailRow
            label="Historical periods"
            value={
              <DetailTags
                values={
                  asset.historicalPeriods
                }
              />
            }
          />

          <DetailRow
            label="Materials"
            value={
              <DetailTags
                values={
                  asset.materialFamilies
                }
              />
            }
          />

          <DetailRow
            label="Colour families"
            value={
              <DetailTags
                values={
                  asset.colourFamilies
                }
              />
            }
          />

        </dl>

      </DetailSection>

      <DetailSection title="Pricing">

        <dl className="asset-detail-properties">

          <DetailRow
            label="Digital asset"
            value={
              asset.access === 'free'
                ? 'Free'
                : asset.digitalPurchasePrice
                  ? formatPrice(
                      asset.digitalPurchasePrice
                    )
                  : 'Price not available'
            }
          />

          <DetailRow
            label="Physical product"
            value={
              asset.estimatedRealWorldPrice
                ? formatPrice(
                    asset.estimatedRealWorldPrice
                  )
                : 'No physical price recorded'
            }
          />

          <DetailRow
            label="Supplier"
            value={
              asset.estimatedRealWorldPrice
                ?.supplierName
            }
          />

        </dl>

        <ExternalReference
          url={
            asset.estimatedRealWorldPrice
              ?.supplierUrl
          }
          label="Visit supplier"
        />

      </DetailSection>

    </>
  );
}

/* ========================================
   TECHNICAL TAB
======================================== */

function TechnicalTab({
  asset,
}: {
  asset: CatalogueAsset;
}) {
  const unit =
    usePreferencesStore(
      (state) =>
        state.preferences.measurementUnit
    );

  const physical =
    asset.physicalProperties;

  const dimensions =
    physical?.dimensions;

  const material =
    asset.materialProperties;

  const placement =
    asset.placement;

  return (
    <>

      <DetailSection title="Physical dimensions">

        {!physical
          ?.technicalSpecificationsVerified && (
            <DetailNotice>
              Dimensions and technical
              characteristics are illustrative
              unless independently verified.
            </DetailNotice>
          )}

        {dimensions ? (
          <dl className="asset-detail-properties">

            <DetailRow
              label="Width"
              value={
                formatMeasurement(
                  dimensions.width,
                  unit
                )
              }
            />

            <DetailRow
              label="Height"
              value={
                formatMeasurement(
                  dimensions.height,
                  unit
                )
              }
            />

            <DetailRow
              label="Depth"
              value={
                formatMeasurement(
                  dimensions.depth,
                  unit
                )
              }
            />

          </dl>

        ) : (
          <p className="asset-detail-muted">
            No fixed dimensions recorded.
          </p>
        )}

        {physical && (
          <dl className="asset-detail-properties">

            <DetailRow
              label="Weight"
              value={
                physical.weightKg !== undefined
                  ? `${physical.weightKg} kg`
                  : undefined
              }
            />

            <DetailRow
              label="Adjustable dimensions"
              value={
                formatBoolean(
                  physical.adjustableDimensions
                )
              }
            />

            <DetailRow
              label="Resizable width"
              value={
                formatBoolean(
                  physical.resizableWidth
                )
              }
            />

            <DetailRow
              label="Resizable height"
              value={
                formatBoolean(
                  physical.resizableHeight
                )
              }
            />

            <DetailRow
              label="Resizable depth"
              value={
                formatBoolean(
                  physical.resizableDepth
                )
              }
            />

            <DetailRow
              label="Indoor suitability"
              value={
                formatBoolean(
                  physical.indoorSuitable
                )
              }
            />

            <DetailRow
              label="Outdoor suitability"
              value={
                formatBoolean(
                  physical.outdoorSuitable
                )
              }
            />

            <DetailRow
              label="Weather resistance"
              value={
                formatBoolean(
                  physical.weatherResistant
                )
              }
            />

            <DetailRow
              label="Water resistance"
              value={
                formatBoolean(
                  physical.waterResistant
                )
              }
            />

            <DetailRow
              label="Fire rating"
              value={
                physical.fireRating
              }
            />

            <DetailRow
              label="Structural use"
              value={
                formatBoolean(
                  physical.structuralUse
                )
              }
            />

          </dl>
        )}

        <ExternalReference
          url={
            physical?.technicalSourceUrl
          }
          label="Technical reference"
        />

      </DetailSection>

      {material && (
        <DetailSection title="Material properties">

          <div className="asset-detail-material-colour">

            <span
              className="asset-detail-large-swatch"
              style={{
                backgroundColor:
                  material.colour.hex,
              }}
              aria-hidden="true"
            />

            <div>

              <strong>
                {material.colour.name}
              </strong>

              <p>
                {material.colour.hex}
              </p>

            </div>

          </div>

          <dl className="asset-detail-properties">

            <DetailRow
              label="Material family"
              value={
                formatLabel(
                  material.family
                )
              }
            />

            <DetailRow
              label="Surface finish"
              value={
                formatLabel(
                  material.finish
                )
              }
            />

            <DetailRow
              label="Roughness"
              value={
                `${Math.round(
                  material.roughness * 100
                )}%`
              }
            />

            <DetailRow
              label="Metallic appearance"
              value={
                `${Math.round(
                  material.metallic * 100
                )}%`
              }
            />

            <DetailRow
              label="Opacity"
              value={
                `${Math.round(
                  material.opacity * 100
                )}%`
              }
            />

          </dl>

        </DetailSection>
      )}

      {placement && (
        <DetailSection title="Placement behaviour">

          <dl className="asset-detail-properties">

            <DetailRow
              label="Allowed surfaces"
              value={
                <DetailTags
                  values={
                    placement.allowedSurfaces
                  }
                />
              }
            />

            <DetailRow
              label="Default surface"
              value={
                formatLabel(
                  placement.defaultSurface
                )
              }
            />

            <DetailRow
              label="Snap to grid"
              value={
                formatBoolean(
                  placement.snapToGrid
                )
              }
            />

            <DetailRow
              label="Snap to wall"
              value={
                formatBoolean(
                  placement.snapToWall
                )
              }
            />

            <DetailRow
              label="Free rotation"
              value={
                formatBoolean(
                  placement.allowFreeRotation
                )
              }
            />

            <DetailRow
              label="Collision enabled"
              value={
                formatBoolean(
                  placement.collisionEnabled
                )
              }
            />

          </dl>

        </DetailSection>
      )}

      <DetailSection title="Digital design capabilities">

        {asset.models.length === 0 &&
          asset.symbols.length === 0 && (
            <DetailNotice>
              This asset does not yet have
              a registered 3D model or
              2D symbol.
            </DetailNotice>
          )}

        {asset.models.map(
          (model) => (
            <div
              key={model.id}
              className="asset-detail-model"
            >
              <Box
                size={22}
                aria-hidden="true"
              />

              <div>

                <strong>
                  {model.format.toUpperCase()}
                  {' — '}
                  {formatLabel(model.quality)}
                </strong>

                <p>
                  {model.url ||
                    model.proceduralGeneratorId
                    ? 'Model definition available'
                    : 'Model definition incomplete'}
                </p>

                {model.recommendedForLightweightMode && (
                  <span className="asset-detail-tag">
                    Lightweight
                  </span>
                )}

              </div>

            </div>
          )
        )}

        {asset.symbols.map(
          (symbol) => (
            <div
              key={symbol.id}
              className="asset-detail-model"
            >
              <Ruler
                size={22}
                aria-hidden="true"
              />

              <div>

                <strong>
                  {symbol.format.toUpperCase()}
                  {' — '}
                  {formatLabel(symbol.view)}
                </strong>

                <p>
                  {symbol.scalable
                    ? 'Scalable symbol'
                    : 'Fixed-scale symbol'}
                </p>

              </div>

            </div>
          )
        )}

      </DetailSection>

    </>
  );
}

/* ========================================
   HERITAGE TAB
======================================== */

function HeritageTab({
  asset,
}: {
  asset: CatalogueAsset;
}) {
  const heritage =
    asset.heritage;

  return (
    <>

      <DetailSection title="Historical identity">

        <DetailTags
          values={
            heritage?.periods ??
            asset.historicalPeriods
          }
        />

        {heritage?.historicalDescription && (
          <p>
            {heritage.historicalDescription}
          </p>
        )}

        {heritage && (
          <dl className="asset-detail-properties">

            <DetailRow
              label="Estimated date from"
              value={
                heritage.estimatedYearFrom
              }
            />

            <DetailRow
              label="Estimated date to"
              value={
                heritage.estimatedYearTo
              }
            />

            <DetailRow
              label="Region"
              value={
                heritage.region
              }
            />

            <DetailRow
              label="Country of origin"
              value={
                heritage.countryOfOrigin
              }
            />

            <DetailRow
              label="Cultural tradition"
              value={
                heritage.culturalTradition
              }
            />

            <DetailRow
              label="Original antique"
              value={
                formatBoolean(
                  heritage.originalAntique
                )
              }
            />

            <DetailRow
              label="Reproduction"
              value={
                formatBoolean(
                  heritage.reproduction
                )
              }
            />

            <DetailRow
              label="Provenance verified"
              value={
                formatBoolean(
                  heritage.provenanceVerified
                )
              }
            />

          </dl>
        )}

      </DetailSection>

      {heritage?.historicalSignificance && (
        <DetailSection title="Historical significance">

          <p>
            {heritage.historicalSignificance}
          </p>

        </DetailSection>
      )}

      {heritage?.provenanceNotes && (
        <DetailSection title="Provenance">

          <p>
            {heritage.provenanceNotes}
          </p>

        </DetailSection>
      )}

      {Boolean(
        heritage?.conservationConsiderations
          ?.length
      ) && (
        <DetailSection title="Conservation considerations">

          <DetailList
            values={
              heritage?.conservationConsiderations
            }
          />

        </DetailSection>
      )}

      {!heritage?.provenanceVerified && (
        <DetailNotice>
          Historical styling does not establish
          an object's authenticity, age
          or provenance.
        </DetailNotice>
      )}

      {heritage?.referenceUrls?.map(
        (url, index) => (
          <ExternalReference
            key={`${index}-${url}`}
            url={url}
            label={`Historical reference ${index + 1}`}
          />
        )
      )}

    </>
  );
}

/* ========================================
   RESTORATION TAB
======================================== */

function RestorationTab({
  asset,
}: {
  asset: CatalogueAsset;
}) {
  const restoration =
    asset.restoration;

  if (!restoration) {
    return null;
  }

  return (
    <>

      <DetailSection title="Condition and restoration">

        <dl className="asset-detail-properties">

          <DetailRow
            label="Current condition"
            value={
              formatLabel(
                restoration.condition
              )
            }
          />

          <DetailRow
            label="Salvageable"
            value={
              formatBoolean(
                restoration.salvageable
              )
            }
          />

          <DetailRow
            label="Restoration possible"
            value={
              formatBoolean(
                restoration.restorationPossible
              )
            }
          />

          <DetailRow
            label="Difficulty"
            value={
              restoration.restorationDifficulty
                ? formatLabel(
                    restoration.restorationDifficulty
                  )
                : undefined
            }
          />

        </dl>

        {restoration.conditionDescription && (
          <p>
            {restoration.conditionDescription}
          </p>
        )}

      </DetailSection>

      <DetailSection title="Restoration estimates">

        <dl className="asset-detail-properties">

          <DetailRow
            label="Original value"
            value={
              restoration.originalValue
                ? formatPrice(
                    restoration.originalValue
                  )
                : 'Not recorded'
            }
          />

          <DetailRow
            label="Current value"
            value={
              restoration.currentValue
                ? formatPrice(
                    restoration.currentValue
                  )
                : 'Not recorded'
            }
          />

          <DetailRow
            label="Estimated restoration cost"
            value={
              restoration.estimatedRestorationCost
                ? formatPrice(
                    restoration.estimatedRestorationCost
                  )
                : 'Not recorded'
            }
          />

          <DetailRow
            label="Estimated restored value"
            value={
              restoration.estimatedRestoredValue
                ? formatPrice(
                    restoration.estimatedRestoredValue
                  )
                : 'Not recorded'
            }
          />

        </dl>

      </DetailSection>

      <DetailSection title="Restoration process">

        {restoration.restorationSteps?.length ? (
          <ol className="asset-restoration-steps">

            {restoration.restorationSteps.map(
              (step, index) => (
                <li
                  key={step.id}
                  className="asset-restoration-step"
                >
                  <span className="asset-restoration-step-number">

                    {index + 1}

                  </span>

                  <div className="asset-restoration-step-content">

                    <h4>
                      {step.name}
                    </h4>

                    <p>
                      {step.description}
                    </p>

                    <dl className="asset-detail-properties">

                      <DetailRow
                        label="Process"
                        value={
                          formatLabel(
                            step.process
                          )
                        }
                      />

                      <DetailRow
                        label="Estimated time"
                        value={
                          step.estimatedHours !== undefined
                            ? `${step.estimatedHours} hours`
                            : undefined
                        }
                      />

                      <DetailRow
                        label="Estimated cost"
                        value={
                          step.estimatedCost
                            ? formatPrice(
                                step.estimatedCost
                              )
                            : undefined
                        }
                      />

                      <DetailRow
                        label="Specialist recommended"
                        value={
                          formatBoolean(
                            step.specialistRecommended
                          )
                        }
                      />

                    </dl>

                    {Boolean(
                      step.requiredMaterials?.length
                    ) && (
                      <>
                        <strong>
                          Materials
                        </strong>

                        <DetailList
                          values={
                            step.requiredMaterials
                          }
                        />
                      </>
                    )}

                    {Boolean(
                      step.requiredTools?.length
                    ) && (
                      <>
                        <strong>
                          Tools
                        </strong>

                        <DetailList
                          values={
                            step.requiredTools
                          }
                        />
                      </>
                    )}

                    {Boolean(
                      step.safetyNotes?.length
                    ) && (
                      <DetailNotice>

                        <DetailList
                          values={
                            step.safetyNotes
                          }
                        />

                      </DetailNotice>
                    )}

                  </div>

                </li>
              )
            )}

          </ol>

        ) : (
          <p className="asset-detail-muted">
            A detailed restoration plan
            has not yet been recorded.
          </p>
        )}

      </DetailSection>

      <DetailNotice>
        Restoration information is intended
        for design planning. Actual condition,
        materials and conservation requirements
        must be assessed before physical work.
      </DetailNotice>

    </>
  );
}

/* ========================================
   PLANT INFORMATION TAB
======================================== */

function PlantTab({
  asset,
}: {
  asset: CatalogueAsset;
}) {
  const unit =
    usePreferencesStore(
      (state) =>
        state.preferences.measurementUnit
    );

  const plant =
    asset.plant;

  if (!plant) {
    return null;
  }

  return (
    <>

      <DetailSection title="Plant identity">

        <dl className="asset-detail-properties">

          <DetailRow
            label="Common name"
            value={
              plant.commonName
            }
          />

          <DetailRow
            label="Scientific name"
            value={
              plant.scientificName
            }
          />

          <DetailRow
            label="Cultivar"
            value={
              plant.cultivar
            }
          />

          <DetailRow
            label="Lifecycle"
            value={
              plant.lifecycle
                ? formatLabel(
                    plant.lifecycle
                  )
                : undefined
            }
          />

          <DetailRow
            label="Hardiness"
            value={
              plant.hardinessRating
            }
          />

        </dl>

      </DetailSection>

      <DetailSection title="Growing requirements">

        <dl className="asset-detail-properties">

          <DetailRow
            label="Sunlight"
            value={
              <DetailTags
                values={
                  plant.sunlight
                }
              />
            }
          />

          <DetailRow
            label="Water requirements"
            value={
              plant.waterRequirement
                ? formatLabel(
                    plant.waterRequirement
                  )
                : undefined
            }
          />

          <DetailRow
            label="Suitable soils"
            value={
              <DetailTags
                values={
                  plant.suitableSoilTypes ??
                  []
                }
              />
            }
          />

          <DetailRow
            label="Mature height"
            value={
              plant.matureHeightMetres !== undefined
                ? formatMeasurement(
                    plant.matureHeightMetres,
                    unit
                  )
                : undefined
            }
          />

          <DetailRow
            label="Mature spread"
            value={
              plant.matureSpreadMetres !== undefined
                ? formatMeasurement(
                    plant.matureSpreadMetres,
                    unit
                  )
                : undefined
            }
          />

          <DetailRow
            label="Recommended spacing"
            value={
              plant.recommendedSpacingMetres !== undefined
                ? formatMeasurement(
                    plant.recommendedSpacingMetres,
                    unit
                  )
                : undefined
            }
          />

          <DetailRow
            label="Growth rate"
            value={
              plant.growthRate
                ? formatLabel(
                    plant.growthRate
                  )
                : undefined
            }
          />

          <DetailRow
            label="Flowering seasons"
            value={
              <DetailTags
                values={
                  plant.floweringSeasons ??
                  []
                }
              />
            }
          />

          <DetailRow
            label="Planting seasons"
            value={
              <DetailTags
                values={
                  plant.plantingSeasons ??
                  []
                }
              />
            }
          />

        </dl>

      </DetailSection>

      <DetailSection title="Wildlife and household suitability">

        <dl className="asset-detail-properties">

          <DetailRow
            label="Wildlife friendly"
            value={
              formatBoolean(
                plant.wildlifeFriendly
              )
            }
          />

          <DetailRow
            label="Pollinator friendly"
            value={
              formatBoolean(
                plant.pollinatorFriendly
              )
            }
          />

          <DetailRow
            label="Potential toxicity to humans"
            value={
              formatBoolean(
                plant.potentiallyToxicToHumans
              )
            }
          />

          <DetailRow
            label="Potential toxicity to cats"
            value={
              formatBoolean(
                plant.potentiallyToxicToCats
              )
            }
          />

          <DetailRow
            label="Potential toxicity to dogs"
            value={
              formatBoolean(
                plant.potentiallyToxicToDogs
              )
            }
          />

        </dl>

        <DetailNotice>
          {plant.toxicityInformationVerified
            ? 'Check the referenced toxicity information for the exact species and cultivar before purchasing.'
            : 'Plant toxicity information is not verified. Missing information must not be interpreted as evidence that a plant is safe.'}
        </DetailNotice>

      </DetailSection>

      {Boolean(
        plant.careInstructions?.length
      ) && (
        <DetailSection title="Care information">

          <DetailList
            values={
              plant.careInstructions
            }
          />

        </DetailSection>
      )}

      {plant.referenceUrls?.map(
        (url, index) => (
          <ExternalReference
            key={`${index}-${url}`}
            url={url}
            label={`Plant reference ${index + 1}`}
          />
        )
      )}

    </>
  );
}

/* ========================================
   ACCESSIBILITY TAB
======================================== */

function AccessibilityTab({
  asset,
}: {
  asset: CatalogueAsset;
}) {
  const unit =
    usePreferencesStore(
      (state) =>
        state.preferences.measurementUnit
    );

  const accessibility =
    asset.accessibility;

  if (!accessibility) {
    return null;
  }

  return (
    <>

      <DetailSection title="Inclusive design features">

        <dl className="asset-detail-properties">

          <DetailRow
            label="Wheelchair compatibility"
            value={
              formatBoolean(
                accessibility.wheelchairCompatible
              )
            }
          />

          <DetailRow
            label="Adjustable height"
            value={
              formatBoolean(
                accessibility.adjustableHeight
              )
            }
          />

          <DetailRow
            label="Accessible controls"
            value={
              formatBoolean(
                accessibility.accessibleControls
              )
            }
          />

          <DetailRow
            label="Low-reach controls"
            value={
              formatBoolean(
                accessibility.lowReachControls
              )
            }
          />

          <DetailRow
            label="Slip resistance"
            value={
              formatBoolean(
                accessibility.slipResistant
              )
            }
          />

          <DetailRow
            label="High-contrast options"
            value={
              formatBoolean(
                accessibility.highContrastAvailable
              )
            }
          />

          <DetailRow
            label="Tactile features"
            value={
              formatBoolean(
                accessibility.tactileFeatures
              )
            }
          />

          <DetailRow
            label="Limited mobility suitability"
            value={
              formatBoolean(
                accessibility.suitableForLimitedMobility
              )
            }
          />

        </dl>

      </DetailSection>

      <DetailSection title="Clearance requirements">

        <dl className="asset-detail-properties">

          <DetailRow
            label="Clear opening width"
            value={
              accessibility.clearOpeningWidthMetres !== undefined
                ? formatMeasurement(
                    accessibility.clearOpeningWidthMetres,
                    unit
                  )
                : undefined
            }
          />

          <DetailRow
            label="Clear opening height"
            value={
              accessibility.clearOpeningHeightMetres !== undefined
                ? formatMeasurement(
                    accessibility.clearOpeningHeightMetres,
                    unit
                  )
                : undefined
            }
          />

          <DetailRow
            label="Required approach width"
            value={
              accessibility.requiredApproachWidthMetres !== undefined
                ? formatMeasurement(
                    accessibility.requiredApproachWidthMetres,
                    unit
                  )
                : undefined
            }
          />

          <DetailRow
            label="Required approach depth"
            value={
              accessibility.requiredApproachDepthMetres !== undefined
                ? formatMeasurement(
                    accessibility.requiredApproachDepthMetres,
                    unit
                  )
                : undefined
            }
          />

          <DetailRow
            label="Minimum turning space"
            value={
              accessibility.minimumTurningSpaceMetres !== undefined
                ? formatMeasurement(
                    accessibility.minimumTurningSpaceMetres,
                    unit
                  )
                : undefined
            }
          />

          <DetailRow
            label="Transfer space required"
            value={
              formatBoolean(
                accessibility.transferSpaceRequired
              )
            }
          />

        </dl>

      </DetailSection>

      <DetailSection title="Standards and verification">

        <dl className="asset-detail-properties">

          <DetailRow
            label="Compliance verified"
            value={
              formatBoolean(
                accessibility.complianceVerified
              )
            }
          />

          <DetailRow
            label="Verification region"
            value={
              accessibility.verificationRegion
            }
          />

          <DetailRow
            label="Applicable standards"
            value={
              <DetailTags
                values={
                  accessibility.applicableStandards ??
                  []
                }
              />
            }
          />

        </dl>

        <DetailList
          values={
            accessibility.accessibilityNotes
          }
        />

        <ExternalReference
          url={
            accessibility.verificationSourceUrl
          }
          label="Accessibility verification source"
        />

        <DetailNotice>
          Asset-level accessibility information
          does not establish compliance of
          an entire building or design.
          Individual requirements and applicable
          regional standards must also be considered.
        </DetailNotice>

      </DetailSection>

    </>
  );
}

/* ========================================
   SUSTAINABILITY TAB
======================================== */

function SustainabilityTab({
  asset,
}: {
  asset: CatalogueAsset;
}) {
  const sustainability =
    asset.sustainability;

  if (!sustainability) {
    return null;
  }

  return (
    <>

      <DetailSection title="Environmental characteristics">

        <dl className="asset-detail-properties">

          <DetailRow
            label="Reclaimed"
            value={
              formatBoolean(
                sustainability.reclaimed
              )
            }
          />

          <DetailRow
            label="Recycled"
            value={
              formatBoolean(
                sustainability.recycled
              )
            }
          />

          <DetailRow
            label="Recyclable"
            value={
              formatBoolean(
                sustainability.recyclable
              )
            }
          />

          <DetailRow
            label="Renewable materials"
            value={
              formatBoolean(
                sustainability.renewableMaterials
              )
            }
          />

          <DetailRow
            label="Locally sourced"
            value={
              formatBoolean(
                sustainability.locallySourced
              )
            }
          />

          <DetailRow
            label="Biodegradable"
            value={
              formatBoolean(
                sustainability.biodegradable
              )
            }
          />

          <DetailRow
            label="Repairable"
            value={
              formatBoolean(
                sustainability.repairable
              )
            }
          />

          <DetailRow
            label="Recycled content"
            value={
              sustainability.recycledContentPercentage !== undefined
                ? `${sustainability.recycledContentPercentage}%`
                : undefined
            }
          />

          <DetailRow
            label="Embodied carbon"
            value={
              sustainability.embodiedCarbonKgCO2e !== undefined
                ? `${sustainability.embodiedCarbonKgCO2e} kg CO₂e`
                : undefined
            }
          />

          <DetailRow
            label="Expected lifespan"
            value={
              sustainability.expectedLifespanYears !== undefined
                ? `${sustainability.expectedLifespanYears} years`
                : undefined
            }
          />

        </dl>

      </DetailSection>

      <DetailSection title="Environmental verification">

        <DetailRowGroup
          label="Claims verified"
          value={
            formatBoolean(
              sustainability.manufacturerClaimsVerified
            )
          }
        />

        <DetailTags
          values={
            sustainability.certifications ??
            []
          }
        />

        <DetailList
          values={
            sustainability.environmentalNotes
          }
        />

        {!sustainability.manufacturerClaimsVerified && (
          <DetailNotice>
            Environmental characteristics
            have not been independently verified.
          </DetailNotice>
        )}

      </DetailSection>

    </>
  );
}

function DetailRowGroup({
  label,

  value,
}: {
  label: string;

  value: ReactNode;
}) {
  return (
    <dl className="asset-detail-properties">

      <DetailRow
        label={label}
        value={value}
      />

    </dl>
  );
}

/* ========================================
   CUSTOMISATION TAB
======================================== */

function CustomisationTab({
  asset,
}: {
  asset: CatalogueAsset;
}) {
  const customisation =
    asset.customisation;

  if (!customisation) {
    return null;
  }

  return (
    <>

      <DetailSection title="Customisation capabilities">

        <dl className="asset-detail-properties">

          <DetailRow
            label="Editable colours"
            value={
              formatBoolean(
                customisation.colourEditable
              )
            }
          />

          <DetailRow
            label="Editable materials"
            value={
              formatBoolean(
                customisation.materialEditable
              )
            }
          />

          <DetailRow
            label="Editable finishes"
            value={
              formatBoolean(
                customisation.finishEditable
              )
            }
          />

          <DetailRow
            label="Editable dimensions"
            value={
              formatBoolean(
                customisation.dimensionsEditable
              )
            }
          />

          <DetailRow
            label="Editable textures"
            value={
              formatBoolean(
                customisation.textureEditable
              )
            }
          />

          <DetailRow
            label="Editable geometry"
            value={
              formatBoolean(
                customisation.geometryEditable
              )
            }
          />

          <DetailRow
            label="Editable upholstery"
            value={
              formatBoolean(
                customisation.upholsteryEditable
              )
            }
          />

          <DetailRow
            label="Editable hardware"
            value={
              formatBoolean(
                customisation.hardwareEditable
              )
            }
          />

        </dl>

        <DetailNotice>
          These are registered asset capabilities.
          Actual editing tools depend on the
          implemented workspace and asset format.
        </DetailNotice>

      </DetailSection>

      <DetailSection title="Available variations">

        {customisation.availableVariants?.length ? (
          <div className="asset-detail-variants">

            {customisation.availableVariants.map(
              (variant) => (
                <article
                  key={variant.id}
                  className="asset-detail-variant"
                >
                  <h4>
                    {variant.name}
                  </h4>

                  {variant.description && (
                    <p>
                      {variant.description}
                    </p>
                  )}

                  <div className="asset-detail-variant-colours">

                    {variant.colours?.map(
                      (colour, index) => (
                        <span
                          key={`${index}-${colour.hex}`}
                          className="asset-detail-variant-colour"
                        >
                          <span
                            className="asset-colour-swatch"
                            style={{
                              backgroundColor:
                                colour.hex,
                            }}
                            aria-hidden="true"
                          />

                          {colour.name}

                        </span>
                      )
                    )}

                  </div>

                  {variant.materials && (
                    <DetailTags
                      values={
                        variant.materials
                      }
                    />
                  )}

                  {variant.finish && (
                    <p>
                      Finish:{' '}

                      {formatLabel(
                        variant.finish
                      )}
                    </p>
                  )}

                  {variant.price && (
                    <p>
                      {formatPrice(
                        variant.price
                      )}
                    </p>
                  )}

                </article>
              )
            )}

          </div>

        ) : (
          <p className="asset-detail-muted">
            No predefined variations recorded.
          </p>
        )}

      </DetailSection>

    </>
  );
}

/* ========================================
   LICENSING TAB
======================================== */

function LicensingTab({
  asset,
}: {
  asset: CatalogueAsset;
}) {
  const licensing =
    asset.licensing;

  return (
    <>

      <DetailSection title="Asset licence">

        <div className="asset-licence-heading">

          <ShieldCheck
            size={28}
            aria-hidden="true"
          />

          <div>

            <strong>
              {formatLabel(
                licensing.licence
              )}
            </strong>

            <p>
              {licensing.licenceVerified
                ? 'Licence verified'
                : 'Licence verification pending'}
            </p>

          </div>

        </div>

        <dl className="asset-detail-properties">

          <DetailRow
            label="Copyright holder"
            value={
              licensing.copyrightHolder
            }
          />

          <DetailRow
            label="Creator"
            value={
              licensing.creatorName
            }
          />

          <DetailRow
            label="Verified on"
            value={
              licensing.verifiedAt
            }
          />

        </dl>

      </DetailSection>

      <DetailSection title="Declared usage permissions">

        <dl className="asset-detail-properties">

          <DetailRow
            label="Personal use"
            value={
              formatBoolean(
                licensing.personalUseAllowed
              )
            }
          />

          <DetailRow
            label="Commercial use"
            value={
              formatBoolean(
                licensing.commercialUseAllowed
              )
            }
          />

          <DetailRow
            label="Modification"
            value={
              formatBoolean(
                licensing.modificationAllowed
              )
            }
          />

          <DetailRow
            label="Redistribution"
            value={
              formatBoolean(
                licensing.redistributionAllowed
              )
            }
          />

          <DetailRow
            label="Resale"
            value={
              formatBoolean(
                licensing.resaleAllowed
              )
            }
          />

          <DetailRow
            label="Attribution required"
            value={
              formatBoolean(
                licensing.attributionRequired
              )
            }
          />

          <DetailRow
            label="Share-alike required"
            value={
              formatBoolean(
                licensing.shareAlikeRequired
              )
            }
          />

        </dl>

        {!licensing.licenceVerified && (
          <DetailNotice>
            These permissions are provisional
            catalogue records, not verified
            legal clearance. Commercial use,
            redistribution and resale must
            not rely on unverified permissions.
          </DetailNotice>
        )}

      </DetailSection>

      {licensing.attributionText && (
        <DetailSection title="Required attribution">

          <p className="asset-licence-attribution">
            {licensing.attributionText}
          </p>

        </DetailSection>
      )}

      {Boolean(
        licensing.restrictions?.length
      ) && (
        <DetailSection title="Licence restrictions">

          <DetailList
            values={
              licensing.restrictions
            }
          />

        </DetailSection>
      )}

      <div className="asset-licence-references">

        <ExternalReference
          url={
            licensing.sourceUrl
          }
          label="Original asset source"
        />

        <ExternalReference
          url={
            licensing.licenceUrl
          }
          label="Full licence terms"
        />

      </div>

    </>
  );
}

/* ========================================
   PERSONAL COLLECTION MANAGEMENT
======================================== */

function PersonalCollections({
  asset,
}: {
  asset: CatalogueAsset;
}) {
  const collections =
    useCatalogueStore(
      (state) =>
        state.personalCollections
    );

  const createCollection =
    useCatalogueStore(
      (state) =>
        state.createPersonalCollection
    );

  const addAsset =
    useCatalogueStore(
      (state) =>
        state.addAssetToCollection
    );

  const removeAsset =
    useCatalogueStore(
      (state) =>
        state.removeAssetFromCollection
    );

  const [creating, setCreating] =
    useState(false);

  const [name, setName] =
    useState('');

  const [message, setMessage] =
    useState('');

  const [error, setError] =
    useState('');

  const inputId =
    useId();

  function handleCreate(): void {
    const trimmedName =
      name.trim();

    if (!trimmedName) {
      setError(
        'Enter a collection name.'
      );

      return;
    }

    try {
      const collection =
        createCollection(
          trimmedName
        );

      addAsset(
        collection.id,

        asset.id
      );

      setMessage(
        `Added to ${collection.name}.`
      );

      setName('');

      setError('');

      setCreating(false);

    } catch {
      setError(
        'Unable to create the collection.'
      );
    }
  }

  return (
    <section className="asset-personal-collections">

      <h3>
        My collections
      </h3>

      <p className="asset-detail-muted">
        Save this asset to your own
        inspiration collections.
      </p>

      <div className="asset-personal-collection-list">

        {collections.map(
          (collection) => {
            const included =
              collection.assetIds.includes(
                asset.id
              );

            return (
              <label
                key={collection.id}
                className="asset-personal-collection-option"
              >
                <input
                  type="checkbox"
                  checked={included}
                  onChange={() => {
                    if (included) {
                      removeAsset(
                        collection.id,

                        asset.id
                      );

                      setMessage(
                        `Removed from ${collection.name}.`
                      );

                    } else {
                      addAsset(
                        collection.id,

                        asset.id
                      );

                      setMessage(
                        `Added to ${collection.name}.`
                      );
                    }
                  }}
                />

                <span>
                  {collection.name}
                </span>

                {included && (
                  <Check
                    size={16}
                    aria-hidden="true"
                  />
                )}

              </label>
            );
          }
        )}

      </div>

      {!creating ? (
        <button
          type="button"
          className="button button-secondary"
          onClick={() => {
            setCreating(true);

            setError('');
          }}
        >
          <FolderPlus
            size={17}
            aria-hidden="true"
          />

          New collection

        </button>

      ) : (
        <form
          className="asset-new-collection-form"
          onSubmit={(event) => {
            event.preventDefault();

            handleCreate();
          }}
        >
          <label
            htmlFor={inputId}
            className="form-label"
          >
            Collection name
          </label>

          <input
            id={inputId}
            className="input"
            value={name}
            maxLength={100}
            autoFocus
            required
            onChange={(event) => {
              setName(
                event.target.value
              );

              setError('');
            }}
          />

          {error && (
            <p
              className="form-error"
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="asset-new-collection-actions">

            <button
              type="submit"
              className="button button-primary"
            >
              Create and save
            </button>

            <button
              type="button"
              className="button button-ghost"
              onClick={() => {
                setCreating(false);

                setName('');

                setError('');
              }}
            >
              Cancel
            </button>

          </div>

        </form>
      )}

      <p
        className="asset-collection-message"
        role="status"
        aria-live="polite"
      >
        {message}
      </p>

    </section>
  );
}

/* ========================================
   DETAIL TAB CONFIGURATION
======================================== */

function getAvailableTabs(
  asset: CatalogueAsset
) {
  return [
    {
      id: 'overview' as const,

      label: 'Overview',

      icon: Layers3,

      available: true,
    },

    {
      id: 'technical' as const,

      label: 'Technical',

      icon: Ruler,

      available: true,
    },

    {
      id: 'heritage' as const,

      label: 'Heritage',

      icon: History,

      available:
        Boolean(asset.heritage) ||
        asset.historicalPeriods.some(
          (period) =>
            period !== 'unknown' &&
            period !== 'timeless'
        ),
    },

    {
      id: 'restoration' as const,

      label: 'Restoration',

      icon: Hammer,

      available:
        Boolean(asset.restoration),
    },

    {
      id: 'plant' as const,

      label: 'Plant information',

      icon: Leaf,

      available:
        Boolean(asset.plant),
    },

    {
      id: 'accessibility' as const,

      label: 'Accessibility',

      icon: Accessibility,

      available:
        Boolean(asset.accessibility),
    },

    {
      id: 'sustainability' as const,

      label: 'Sustainability',

      icon: Leaf,

      available:
        Boolean(asset.sustainability),
    },

    {
      id: 'customisation' as const,

      label: 'Customisation',

      icon: Palette,

      available:
        Boolean(asset.customisation),
    },

    {
      id: 'licensing' as const,

      label: 'Licensing',

      icon: ShieldCheck,

      available: true,
    },
  ].filter(
    (tab) =>
      tab.available
  );
}

/* ========================================
   DETAIL TAB CONTENT
======================================== */

function DetailTabContent({
  asset,

  tab,
}: {
  asset: CatalogueAsset;

  tab: DetailTab;
}) {
  switch (tab) {
    case 'technical':
      return (
        <TechnicalTab asset={asset} />
      );

    case 'heritage':
      return (
        <HeritageTab asset={asset} />
      );

    case 'restoration':
      return (
        <RestorationTab asset={asset} />
      );

    case 'plant':
      return (
        <PlantTab asset={asset} />
      );

    case 'accessibility':
      return (
        <AccessibilityTab asset={asset} />
      );

    case 'sustainability':
      return (
        <SustainabilityTab asset={asset} />
      );

    case 'customisation':
      return (
        <CustomisationTab asset={asset} />
      );

    case 'licensing':
      return (
        <LicensingTab asset={asset} />
      );

    default:
      return (
        <OverviewTab asset={asset} />
      );
  }
}

/* ========================================
   ASSET DETAILS CONTENT
======================================== */

function AssetDetailsContent({
  asset,

  onClose,

  onAdd,

  titleId,
}: {
  asset: CatalogueAsset;

  onClose: () => void;

  onAdd?: (
    asset: CatalogueAsset
  ) => void;

  titleId: string;
}) {
  const [activeTab, setActiveTab] =
    useState<DetailTab>(
      'overview'
    );

  const favourite =
    useCatalogueStore(
      (state) =>
        state.favourites.some(
          (item) =>
            item.assetId === asset.id
        )
    );

  const toggleFavourite =
    useCatalogueStore(
      (state) =>
        state.toggleFavourite
    );

  const tabs =
    getAvailableTabs(asset);

  const effectiveTab =
    tabs.some(
      (tab) =>
        tab.id === activeTab
    )
      ? activeTab
      : 'overview';

  const modelAvailable =
    asset.models.some(
      (model) =>
        Boolean(
          model.url ||
          model.proceduralGeneratorId
        )
    );

  const symbolAvailable =
    asset.symbols.some(
      (symbol) =>
        Boolean(
          symbol.url ||
          symbol.proceduralGeneratorId
        )
    );

  const materialAvailable =
    [
      'materials',
      'flooring',
      'wall-coverings',
      'ceiling-finishes',
    ].includes(asset.category) &&
    Boolean(asset.materialProperties) &&
    !asset.physicalProperties?.dimensions;

  const designAvailable =
    modelAvailable ||
    symbolAvailable ||
    materialAvailable;

  const canAdd =
    asset.published &&
    asset.access === 'free' &&
    designAvailable &&
    Boolean(onAdd);

  const contentId =
    useId();

  return (
    <div className="asset-details-dialog-inner">

      <header className="asset-details-dialog-header">

        <div>

          <span className="asset-details-category">

            {formatLabel(
              asset.category
            )}

          </span>

          <h2 id={titleId}>

            {asset.name}

          </h2>

        </div>

        <button
          type="button"
          className="icon-button"
          aria-label="Close asset details"
          onClick={onClose}
        >
          <X
            size={24}
            aria-hidden="true"
          />
        </button>

      </header>

      <div className="asset-details-dialog-body">

        <aside className="asset-details-preview-panel">

          <AssetPreview
            asset={asset}
            size="large"
          />

          <button
            type="button"
            className={[
              'button',

              'button-secondary',

              'asset-details-favourite',

              favourite
                ? 'asset-details-favourite-active'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-pressed={favourite}
            onClick={() =>
              toggleFavourite(
                asset.id
              )
            }
          >
            <Heart
              size={19}
              fill={
                favourite
                  ? 'currentColor'
                  : 'none'
              }
              aria-hidden="true"
            />

            {favourite
              ? 'Saved to favourites'
              : 'Save to favourites'}

          </button>

          <PersonalCollections
            asset={asset}
          />

        </aside>

        <div className="asset-details-information-panel">

          <nav
            className="asset-details-tabs"
            aria-label="Asset information sections"
          >
            {tabs.map(
              (tab) => {
                const Icon =
                  tab.icon;

                const active =
                  effectiveTab ===
                  tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={[
                      'asset-details-tab',

                      active
                        ? 'asset-details-tab-active'
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-pressed={active}
                    aria-controls={contentId}
                    onClick={() =>
                      setActiveTab(
                        tab.id
                      )
                    }
                  >
                    <Icon
                      size={17}
                      aria-hidden="true"
                    />

                    {tab.label}

                  </button>
                );
              }
            )}
          </nav>

          <div
            id={contentId}
            className="asset-details-tab-content"
            role="region"
            aria-label={
              tabs.find(
                (tab) =>
                  tab.id === effectiveTab
              )?.label ??
              'Asset information'
            }
          >
            <DetailTabContent
              asset={asset}
              tab={effectiveTab}
            />
          </div>

        </div>

      </div>

      <footer className="asset-details-dialog-footer">

        <div className="asset-details-footer-status">

          {asset.access === 'free' ? (
            <span className="asset-price-free">
              Free catalogue asset
            </span>

          ) : (
            <span>
              {formatLabel(
                asset.access
              )}{' '}asset
            </span>
          )}

          {!designAvailable && (
            <small>
              Design model not yet available
            </small>
          )}

        </div>

        <div className="asset-details-footer-actions">

          <button
            type="button"
            className="button button-secondary"
            onClick={onClose}
          >
            Close
          </button>

          {onAdd && (
            <button
              type="button"
              className="button button-primary"
              disabled={!canAdd}
              onClick={() => {
                if (canAdd) {
                  onAdd(asset);
                }
              }}
            >
              <Plus
                size={18}
                aria-hidden="true"
              />

              {!asset.published
                ? 'Unavailable'
                : asset.access !== 'free'
                  ? 'Access required'
                  : !designAvailable
                    ? 'Coming soon'
                    : materialAvailable
                      ? 'Use material'
                      : 'Add to design'}

            </button>
          )}

        </div>

      </footer>

    </div>
  );
}

/* ========================================
   MAIN NATIVE DIALOG
======================================== */

export default function AssetDetailsDialog({
  asset,

  open,

  onClose,

  onAdd,
}: AssetDetailsDialogProps) {
  const dialogRef =
    useRef<HTMLDialogElement>(
      null
    );

  const titleId =
    useId();

  const recordAssetView =
    useCatalogueStore(
      (state) =>
        state.recordAssetView
    );

  const assetId =
    asset?.id;

  const shouldOpen =
    open &&
    Boolean(asset);

  useEffect(() => {
    const dialog =
      dialogRef.current;

    if (!dialog) {
      return;
    }

    if (
      shouldOpen &&
      !dialog.open
    ) {
      dialog.showModal();

    } else if (
      !shouldOpen &&
      dialog.open
    ) {
      dialog.close();
    }
  }, [
    shouldOpen,
  ]);

  useEffect(() => {
    if (
      shouldOpen &&
      assetId
    ) {
      recordAssetView(
        assetId
      );
    }
  }, [
    shouldOpen,
    assetId,
    recordAssetView,
  ]);

  return (
    <dialog
      ref={dialogRef}
      className="studio-dialog asset-details-dialog"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();

        onClose();
      }}
      onClick={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      {asset && shouldOpen && (
        <AssetDetailsContent
          key={asset.id}
          asset={asset}
          onClose={onClose}
          onAdd={onAdd}
          titleId={titleId}
        />
      )}
    </dialog>
  );
}
