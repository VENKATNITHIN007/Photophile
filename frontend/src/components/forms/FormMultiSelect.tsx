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
import { Checkbox } from "@/components/ui/checkbox";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

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

export function FormMultiSelect<T extends FieldValues>({
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
