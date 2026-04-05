import { SpinnerIcon } from "@phosphor-icons/react";
import { Button } from "./ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface FieldValues {
  name?: string;
  homepageUrl?: string;
  description?: string | null;
  callbackUrl?: string;
}

type ClientFormProps = {
  form: { type: "register" } | { type: "update"; clientId: string };
  action: (payload: FormData) => void;
  disabled: boolean;
  fieldValues?: FieldValues;
  fieldErrors?: {
    [key in keyof FieldValues]?: string[];
  };
  formErrors?: string[];
};

export default function ApplicationForm({
  action,
  disabled,
  fieldValues,
  fieldErrors,
  formErrors,
  form,
}: ClientFormProps) {
  return (
    <form action={action}>
      {form.type === "update" && (
        <input name="id" value={form.clientId} hidden readOnly />
      )}
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="app-name">Application name</FieldLabel>
          <Input
            id="app-name"
            name="app-name"
            type="text"
            defaultValue={fieldValues?.name}
            disabled={disabled}
            required
          />
          <FieldDescription>
            Something users will recognize and trust.
          </FieldDescription>
          <FieldError errors={fieldErrors?.name} />
        </Field>

        <Field>
          <FieldLabel htmlFor="homepage-url">Homepage URL</FieldLabel>
          <Input
            id="homepage-url"
            name="homepage-url"
            type="url"
            defaultValue={fieldValues?.homepageUrl}
            disabled={disabled}
            required
          />
          <FieldDescription>
            The full URL to your application homepage
          </FieldDescription>
          <FieldError errors={fieldErrors?.homepageUrl} />
        </Field>

        <Field>
          <FieldLabel htmlFor="app-description">
            Application description
          </FieldLabel>
          <Textarea
            id="app-description"
            name="app-description"
            defaultValue={fieldValues?.description ?? undefined}
            disabled={disabled}
          />
          <FieldDescription>
            This is displayed to all users of your application
          </FieldDescription>
          <FieldError errors={fieldErrors?.description} />
        </Field>

        <Field>
          <FieldLabel htmlFor="callback-url">Callback URL</FieldLabel>
          <Input
            id="callback-url"
            name="callback-url"
            type="url"
            defaultValue={fieldValues?.callbackUrl}
            disabled={disabled}
            required
          />
          <FieldDescription>
            Your Application&apos;s callback URL
          </FieldDescription>
          <FieldError errors={fieldErrors?.callbackUrl} />
        </Field>

        <Field orientation="horizontal">
          <Button type="submit" disabled={disabled}>
            {disabled && <SpinnerIcon className="animate-spin" />}
            {form.type === "register" && "Register application"}
            {form.type === "update" && "Update"}
          </Button>
          {form.type === "register" && (
            <Button type="button" variant="secondary" disabled={disabled}>
              Cancel
            </Button>
          )}
          <FieldError errors={formErrors} />
        </Field>
      </FieldGroup>
    </form>
  );
}
