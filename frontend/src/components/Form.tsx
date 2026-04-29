import React from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

// ── 1. Form.Input ──────────────────────────────────────────────────

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
}

function Input<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  description,
  disabled = false,
}: FormInputProps<T>) {
  const fieldId = String(name).replace(/\./g, "-");

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
          <ShadcnInput
            id={fieldId}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={fieldState.invalid}
            {...field}
            value={field.value || ""}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}

// ── 2. Form.Textarea ───────────────────────────────────────────────

interface FormTextareaProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  rows?: number;
}

function Textarea<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  disabled = false,
  rows = 4,
}: FormTextareaProps<T>) {
  const fieldId = String(name).replace(/\./g, "-");

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
          <ShadcnTextarea
            id={fieldId}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className="resize-none"
            aria-invalid={fieldState.invalid}
            {...field}
            value={field.value || ""}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}

// ── 3. Form.Select ─────────────────────────────────────────────────

export interface SelectOption {
  label: string;
  value: string;
}

interface FormSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  description?: string;
  disabled?: boolean;
}

function Select<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Select an option",
  description,
  disabled = false,
}: FormSelectProps<T>) {
  const fieldId = String(name).replace(/\./g, "-");

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
          <ShadcnSelect
            disabled={disabled}
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value ?? ""}
          >
            <SelectTrigger id={fieldId} aria-invalid={fieldState.invalid}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </ShadcnSelect>
          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}

// ── 4. Form.MultiSelect ────────────────────────────────────────────

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface FormMultiSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: MultiSelectOption[];
  description?: string;
  disabled?: boolean;
}

function MultiSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  description,
  disabled = false,
}: FormMultiSelectProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedValues: string[] = Array.isArray(field.value)
          ? (field.value as string[])
          : [];

        return (
          <FieldSet data-invalid={fieldState.invalid}>
            <FieldLegend variant="label">{label}</FieldLegend>
            {description && <FieldDescription>{description}</FieldDescription>}
            <FieldGroup data-slot="checkbox-group" className="grid grid-cols-2 gap-2">
              {options.map((item) => {
                const inputId = `${String(name).replace(/\./g, "-")}-${item.value}`;
                const isChecked = selectedValues.includes(item.value);

                return (
                  <Field
                    key={item.value}
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                    className="justify-start gap-3"
                  >
                    <Checkbox
                      id={inputId}
                      checked={isChecked}
                      disabled={disabled}
                      aria-invalid={fieldState.invalid}
                      onCheckedChange={(checked) => {
                        const nextValues = checked === true
                          ? [...selectedValues, item.value]
                          : selectedValues.filter((value: string) => value !== item.value);

                        field.onChange(nextValues);
                      }}
                    />
                    <FieldLabel htmlFor={inputId} className="cursor-pointer font-normal text-sm">
                      {item.label}
                    </FieldLabel>
                  </Field>
                );
              })}
            </FieldGroup>
            <FieldError errors={[fieldState.error]} />
          </FieldSet>
        );
      }}
    />
  );
}

// ── Compound Export ────────────────────────────────────────────────

export const Form = {
  Input,
  Textarea,
  Select,
  MultiSelect,
};
