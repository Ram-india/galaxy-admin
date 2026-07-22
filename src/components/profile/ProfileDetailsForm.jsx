import { useState } from "react";
import { User, Phone, Mail, Briefcase, Save } from "lucide-react";

import * as authApi from "../../services/authService";
import FormField from "../ui/FormField";
import Button from "../ui/Button";

/** Editable account details. Email is read-only — changing it needs verification. */
const ProfileDetailsForm = ({ user, onSaved, onError }) => {
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    designation: user?.designation || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const isDirty =
    form.name !== (user?.name || "") ||
    form.phone !== (user?.phone || "") ||
    form.designation !== (user?.designation || "");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const res = await authApi.updateProfile(form);
      onSaved(res.data.admin, "Profile updated.");
    } catch (err) {
      onError(err?.response?.data?.message || "Could not save your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Full name"
          name="name"
          icon={User}
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
          required
        />

        <FormField
          label="Email address"
          name="email"
          type="email"
          icon={Mail}
          value={user?.email || ""}
          readOnly
          disabled
          hint="Contact an administrator to change your email."
          className="opacity-70"
        />

        <FormField
          label="Phone"
          name="phone"
          icon={Phone}
          placeholder="+91 98765 43210"
          value={form.phone}
          onChange={handleChange}
          autoComplete="tel"
        />

        <FormField
          label="Designation"
          name="designation"
          icon={Briefcase}
          placeholder="Operations Manager"
          value={form.designation}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={isSaving}
          disabled={!isDirty}
          icon={Save}
        >
          Save changes
        </Button>
      </div>
    </form>
  );
};

export default ProfileDetailsForm;
