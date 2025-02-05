import { LoadingElement } from "@/components/LoadingElement";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePassword, useUserData } from "@nhost/react";
import { useForm } from "react-hook-form";
import zod from "zod";
import * as RadixForm from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const UserProfile = () => {
  const user = useUserData();

  const { data, loading, error } = useSubscription<
    GQL_GET_USER_WITH_USER_PROFILE_QUERY,
    GQL_GET_USER_WITH_USER_PROFILE_QUERY_VARIABLES
  >(
    gql`
      subscription GET_USER_WITH_USER_PROFILE($id: uuid!) {
        user(id: $id) {
          user_profile {
            id
            org_user {
              id
              organization {
                id
                title
              }
            }
          }
          id
          email
          emailVerified
          displayName
        }
      }
    `,
    {
      variables: {
        id: user!.id,
      },
      skip: !user?.id,
    },
  );

  if (loading) return <LoadingElement />;
  else if (error) return <div>Error: {error.message}</div>;
  else if (data?.user) {
    const gqlUser = data.user;
    return (
      <div>
        <h1>Name: {gqlUser.displayName}</h1>
        <p>Email: {gqlUser.email}</p>
        <p>Email verified: {gqlUser.emailVerified ? "Verified" : "Not verified"}</p>
        <p>
          Current org:{" "}
          {gqlUser.user_profile?.org_user.organization.title ||
            gqlUser.user_profile?.org_user.organization.id}
        </p>
        <UpdateOrgForm org={gqlUser.user_profile?.org_user.organization} />
        <ChangePasswordForm />
      </div>
    );
  }
};

const ChangePasswordForm = () => {
  const { changePassword, isLoading, isSuccess, isError, error } = useChangePassword();

  const formSchema = zod
    .object({
      newPassword: zod.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: zod.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  const form = useForm<zod.infer<typeof formSchema>>({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = async ({ newPassword }: zod.infer<typeof formSchema>) => {
    try {
      const { error } = await changePassword(newPassword);
      if (error) throw error;
      toast.success("Password updated successfully");
      form.reset();
    } catch (error) {
      toast.error("Failed to update password");
    }
  };

  return (
    <RadixForm.Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div>
          <RadixForm.FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <RadixForm.FormItem>
                <RadixForm.FormLabel>New Password</RadixForm.FormLabel>
                <RadixForm.FormControl>
                  <Input type="password" {...field} />
                </RadixForm.FormControl>
                <RadixForm.FormMessage />
              </RadixForm.FormItem>
            )}
          />
        </div>

        <div>
          <RadixForm.FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <RadixForm.FormItem>
                <RadixForm.FormLabel>Confirm Password</RadixForm.FormLabel>
                <RadixForm.FormControl>
                  <Input type="password" {...field} />
                </RadixForm.FormControl>
                <RadixForm.FormMessage />
              </RadixForm.FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </RadixForm.Form>
  );
};

const UpdateOrgForm = ({ org }: { org: { title: string; id: string } }) => {
  const formSchema = zod.object({
    title: zod.string().min(1),
  });

  const form = useForm({
    defaultValues: {
      title: org.title,
    },
    resolver: zodResolver(formSchema),
  });

  const [updateOrg, { loading: updateOrgLoading, error: updateOrgError }] = useMutation<
    GQL_UPDATE_ORG_MUTATION,
    {
      id: string;
      update: {
        title: string;
      };
    }
  >(gql`
    mutation UPDATE_ORG($id: uuid!, $update: orgs_organizations_set_input!) {
      update_orgs_organizations_by_pk(pk_columns: { id: $id }, _set: $update) {
        id
      }
    }
  `);

  const handleSubmit = async (formData: zod.infer<typeof formSchema>) => {
    try {
      await updateOrg({
        variables: {
          id: org.id,
          update: { title: formData.title },
        },
      });
      toast.success("Organization name updated successfully");
    } catch (error) {
      toast.error("Failed to update organization name");
    }
  };

  return (
    <RadixForm.Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col md:flex-row gap-4 py-4 items-end">
          <div className="flex-1">
            <RadixForm.FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <RadixForm.FormItem>
                  <RadixForm.FormLabel>Title</RadixForm.FormLabel>
                  <RadixForm.FormControl>
                    <Input {...field} disabled={updateOrgLoading} />
                  </RadixForm.FormControl>
                  <RadixForm.FormMessage />
                </RadixForm.FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={updateOrgLoading}>
            {updateOrgLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Updating...
              </>
            ) : (
              "Update name"
            )}
          </Button>
        </div>
      </form>
    </RadixForm.Form>
  );
};
