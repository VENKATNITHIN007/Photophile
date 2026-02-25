import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Control, FieldValues, Path } from "react-hook-form";

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
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="text-base">{label}</FormLabel>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {options.map((item) => (
              <FormField
                key={item.value}
                control={control}
                name={name}
                render={({ field }) => {
                  return (
                    <FormItem
                      key={item.value}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item.value)}
                          disabled={disabled}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...(field.value || []), item.value])
                              : field.onChange(
                                  field.value?.filter(
                                    (value: string) => value !== item.value
                                  )
                                )
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal text-sm cursor-pointer">
                        {item.label}
                      </FormLabel>
                    </FormItem>
                  )
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}