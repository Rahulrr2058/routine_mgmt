import { Checkbox, Group, Text } from "@mantine/core";

const CheckboxGroup = ({
                           field,
                           label,
                           options,
                           error,
                           multiple = false,
                           required = false,
                       }: any) => {
    const handleChange = (value: string, checked: boolean) => {
        if (multiple) {
            // For multi-select, manage an array of values
            const currentValues = Array.isArray(field.value) ? field.value : [];
            if (checked) {
                field.onChange([...currentValues, value]);
            } else {
                field.onChange(currentValues.filter((v: string) => v !== value));
            }
        } else {
            // For single-select, set or unset the value
            field.onChange(checked ? value : "");
        }
    };

    return (
        <div className="mt-4">
            <Text size="sm" mb="xs">
                {label} {required && <span className="text-red-700">*</span>}
            </Text>
            <Group >
                {options?.map((option:any) => (
                    <Checkbox
                        key={option.value}
                        label={option.label}
                        value={option.value}
                        checked={
                            multiple
                                ? (field.value || []).includes(option.value)
                                : field.value === option.value
                        }
                        onChange={(event) => handleChange(option.value, event.currentTarget.checked)}
                    />
                ))}
            </Group>
            {error && (
                <Text color="red" size="xs" mt="xs">
                    {error}
                </Text>
            )}
        </div>
    );
};

export default CheckboxGroup;