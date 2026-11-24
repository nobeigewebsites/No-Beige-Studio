
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from 'react';

import { useNavigate } from 'react-router-dom';

import {
  X,
  Plus,
  Check,
  Ruler,
  Sparkles,
} from 'lucide-react';

import {
  STUDIOS,
  getStudio,
} from '../config/studios';

import {
  useProjectStore,
} from '../store/projectStore';

import {
  usePreferencesStore,
} from '../store/preferencesStore';

import type {
  StudioId,
  ProjectCategory,
  DesignMode,
  MeasurementUnit,
} from '../types/studio';

import { StudioIcon } from './StudioCard';

/* ========================================
   NO BEIGE STUDIO
   Create Project Dialog
======================================== */

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
  initialStudio?: StudioId;
}

const PROJECT_CATEGORIES: {
  value: ProjectCategory;
  label: string;
}[] = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'historical', label: 'Historical / Heritage' },
  { value: 'outdoor', label: 'Garden / Outdoor' },
  { value: 'furniture', label: 'Furniture / Object' },
  { value: 'concept', label: 'Creative Concept' },
  { value: 'other', label: 'Other' },
];

const MEASUREMENT_UNITS: {
  value: MeasurementUnit;
  label: string;
}[] = [
  { value: 'mm', label: 'Millimetres (mm)' },
  { value: 'cm', label: 'Centimetres (cm)' },
  { value: 'm', label: 'Metres (m)' },
  { value: 'in', label: 'Inches (in)' },
  { value: 'ft', label: 'Feet (ft)' },
];

const CURRENCIES = [
  { value: 'GBP', label: 'GBP — British Pound' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'CAD', label: 'CAD — Canadian Dollar' },
  { value: 'AUD', label: 'AUD — Australian Dollar' },
  { value: 'NZD', label: 'NZD — New Zealand Dollar' },
  { value: 'JPY', label: 'JPY — Japanese Yen' },
  { value: 'INR', label: 'INR — Indian Rupee' },
  { value: 'CHF', label: 'CHF — Swiss Franc' },
  { value: 'ZAR', label: 'ZAR — South African Rand' },
];

/* ========================================
   DEFAULT PROJECT CATEGORY
======================================== */

function getDefaultCategory(
  studioId: StudioId
): ProjectCategory {
  switch (studioId) {
    case 'restoration':
      return 'historical';

    case 'landscape':
      return 'outdoor';

    case 'creator':
      return 'furniture';

    default:
      return 'residential';
  }
}

/* ========================================
   PROJECT CREATION COMPONENT
======================================== */

export default function CreateProjectDialog({
  open,
  onClose,
  initialStudio = 'architecture',
}: CreateProjectDialogProps) {
  const navigate = useNavigate();

  const dialogRef =
    useRef<HTMLDialogElement>(null);

  const nameRef =
    useRef<HTMLInputElement>(null);

  const titleId = useId();
  const descriptionId = useId();

  const preferences = usePreferencesStore(
    (state) => state.preferences
  );

  const createProject = useProjectStore(
    (state) => state.createProject
  );

  const [name, setName] = useState('');
  const [description, setDescription] =
    useState('');

  const [studioId, setStudioId] =
    useState<StudioId>(initialStudio);

  const [category, setCategory] =
    useState<ProjectCategory>(
      getDefaultCategory(initialStudio)
    );

  const [designMode, setDesignMode] =
    useState<DesignMode>(
      preferences.defaultDesignMode
    );

  const [measurementUnit, setMeasurementUnit] =
    useState<MeasurementUnit>(
      preferences.measurementUnit
    );

  const [currency, setCurrency] =
    useState(preferences.currency);

  const [budget, setBudget] = useState('');

  const [error, setError] = useState('');

  /* --------------------------------------
     DIALOG LIFECYCLE
  -------------------------------------- */

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (open && !dialog.open) {
      const defaults =
        usePreferencesStore.getState().preferences;

      setName('');
      setDescription('');
      setStudioId(initialStudio);

      setCategory(
        getDefaultCategory(initialStudio)
      );

      setDesignMode(
        defaults.defaultDesignMode
      );

      setMeasurementUnit(
        defaults.measurementUnit
      );

      setCurrency(defaults.currency);
      setBudget('');
      setError('');

      dialog.showModal();
      nameRef.current?.focus();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, initialStudio]);

  /* --------------------------------------
     STUDIO SELECTION
  -------------------------------------- */

  function handleStudioChange(
    selectedStudio: StudioId
  ) {
    setStudioId(selectedStudio);

    setCategory(
      getDefaultCategory(selectedStudio)
    );
  }

  /* --------------------------------------
     PROJECT VALIDATION AND CREATION
  -------------------------------------- */

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError('');

    const cleanName = name.trim();

    if (!cleanName) {
      setError('Please enter a project name.');
      nameRef.current?.focus();
      return;
    }

    if (cleanName.length > 150) {
      setError(
        'Project names must be 150 characters or fewer.'
      );

      return;
    }

    const parsedBudget =
      budget.trim() === ''
        ? null
        : Number(budget);

    if (
      parsedBudget !== null &&
      (
        !Number.isFinite(parsedBudget) ||
        parsedBudget < 0
      )
    ) {
      setError(
        'Please enter a valid project budget.'
      );

      return;
    }

    try {
      const project = createProject({
        name: cleanName,
        description: description.trim(),
        primaryStudio: studioId,
        category,
        designMode,
        measurementUnit,
        currency,
        budget: parsedBudget,
      });

      onClose();

      navigate(
        getStudio(project.primaryStudio).route
      );
    } catch {
      setError(
        'The project could not be created. Please try again.'
      );
    }
  }

  const currencyOptions = CURRENCIES.some(
    (item) => item.value === currency
  )
    ? CURRENCIES
    : [
        ...CURRENCIES,
        {
          value: currency,
          label: currency,
        },
      ];

  return (
    <dialog
      ref={dialogRef}
      className="studio-dialog create-project-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="dialog-inner">

        {/* Dialog header */}

        <header className="dialog-header">
          <div>
            <h2 id={titleId}>
              Create a New Project
            </h2>

            <p id={descriptionId}>
              Every extraordinary design starts
              somewhere.
            </p>
          </div>

          <button
            type="button"
            className="icon-button"
            aria-label="Close project creation"
            onClick={onClose}
          >
            <X size={23} />
          </button>
        </header>

        <form onSubmit={handleSubmit}>

          <div className="dialog-body">

            {/* Project information */}

            <div className="form-group">
              <label
                htmlFor={`${titleId}-name`}
                className="form-label"
              >
                Project name
              </label>

              <input
                ref={nameRef}
                id={`${titleId}-name`}
                className="input"
                type="text"
                value={name}
                maxLength={150}
                placeholder="My extraordinary creation"
                required
                onChange={(event) =>
                  setName(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label
                htmlFor={`${titleId}-description`}
                className="form-label"
              >
                Description (optional)
              </label>

              <textarea
                id={`${titleId}-description`}
                className="textarea"
                value={description}
                maxLength={2000}
                placeholder="Tell us about your idea..."
                onChange={(event) =>
                  setDescription(event.target.value)
                }
              />
            </div>

            {/* Starting studio */}

            <fieldset className="studio-fieldset">
              <legend className="form-label">
                Choose your starting studio
              </legend>

              <div className="studio-picker-grid">
                {STUDIOS.map((studio) => (
                  <button
                    key={studio.id}
                    type="button"
                    className={[
                      'studio-picker-option',
                      studioId === studio.id
                        ? 'studio-picker-selected'
                        : '',
                    ].join(' ')}
                    aria-pressed={
                      studioId === studio.id
                    }
                    style={{
                      borderColor:
                        studioId === studio.id
                          ? studio.colour
                          : undefined,
                    }}
                    onClick={() =>
                      handleStudioChange(studio.id)
                    }
                  >
                    <span
                      className="studio-picker-icon"
                      style={{
                        color: studio.colour,
                      }}
                    >
                      <StudioIcon
                        studioId={studio.id}
                        size={25}
                      />
                    </span>

                    <span>{studio.shortName}</span>

                    {studioId === studio.id && (
                      <Check
                        size={16}
                        style={{
                          color: studio.colour,
                        }}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                ))}
              </div>

              <p className="form-hint">
                You can connect additional studios
                to this project at any time.
              </p>
            </fieldset>

            {/* Project category */}

            <div className="form-group">
              <label
                htmlFor={`${titleId}-category`}
                className="form-label"
              >
                Project category
              </label>

              <select
                id={`${titleId}-category`}
                className="select"
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value as ProjectCategory
                  )
                }
              >
                {PROJECT_CATEGORIES.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Design mode */}

            <fieldset className="studio-fieldset">
              <legend className="form-label">
                Design mode
              </legend>

              <div className="design-mode-grid">

                <button
                  type="button"
                  className={[
                    'design-mode-option',
                    designMode === 'reality'
                      ? 'design-mode-selected'
                      : '',
                  ].join(' ')}
                  aria-pressed={
                    designMode === 'reality'
                  }
                  onClick={() =>
                    setDesignMode('reality')
                  }
                >
                  <Ruler
                    size={26}
                    style={{
                      color: 'var(--cyan)',
                    }}
                    aria-hidden="true"
                  />

                  <strong>Reality Mode</strong>

                  <span>
                    Design with real-world dimensions
                    and practical considerations.
                  </span>
                </button>

                <button
                  type="button"
                  className={[
                    'design-mode-option',
                    designMode === 'rebel'
                      ? 'design-mode-selected'
                      : '',
                  ].join(' ')}
                  aria-pressed={
                    designMode === 'rebel'
                  }
                  onClick={() =>
                    setDesignMode('rebel')
                  }
                >
                  <Sparkles
                    size={26}
                    style={{
                      color: 'var(--pink)',
                    }}
                    aria-hidden="true"
                  />

                  <strong>Rebel Mode</strong>

                  <span>
                    Experiment freely and explore
                    unconventional creative ideas.
                  </span>
                </button>

              </div>
            </fieldset>

            {/* Measurements and budget */}

            <div className="form-column-grid">

              <div className="form-group">
                <label
                  htmlFor={`${titleId}-units`}
                  className="form-label"
                >
                  Measurement units
                </label>

                <select
                  id={`${titleId}-units`}
                  className="select"
                  value={measurementUnit}
                  onChange={(event) =>
                    setMeasurementUnit(
                      event.target.value as MeasurementUnit
                    )
                  }
                >
                  {MEASUREMENT_UNITS.map((unit) => (
                    <option
                      key={unit.value}
                      value={unit.value}
                    >
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label
                  htmlFor={`${titleId}-currency`}
                  className="form-label"
                >
                  Currency
                </label>

                <select
                  id={`${titleId}-currency`}
                  className="select"
                  value={currency}
                  onChange={(event) =>
                    setCurrency(event.target.value)
                  }
                >
                  {currencyOptions.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div className="form-group">
              <label
                htmlFor={`${titleId}-budget`}
                className="form-label"
              >
                Project budget (optional)
              </label>

              <input
                id={`${titleId}-budget`}
                className="input"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={budget}
                placeholder="Enter your estimated budget"
                onChange={(event) =>
                  setBudget(event.target.value)
                }
              />

              <p className="form-hint">
                Your budget can be changed as your
                project develops.
              </p>
            </div>

            {/* Validation message */}

            {error && (
              <div
                className="form-error"
                role="alert"
              >
                {error}
              </div>
            )}

          </div>

          {/* Dialog actions */}

          <footer className="dialog-footer">
            <button
              type="button"
              className="button button-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="button button-primary"
            >
              <Plus size={19} />

              Create Project
            </button>
          </footer>

        </form>
      </div>
    </dialog>
  );
}
