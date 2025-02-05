import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUpEmailPassword } from "@nhost/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SignUp() {
  const navigate = useNavigate();
  const [showEmailVerificationDialog, setShowEmailVerificationDialog] =
    useState(false);

  const { signUpEmailPassword } = useSignUpEmailPassword();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;
    const result = await signUpEmailPassword(email, password);
    if (result.isError) {
      toast.error(result.error?.message);
    } else if (result.needsEmailVerification) {
      setShowEmailVerificationDialog(true);
    } else if (result.isSuccess) {
      navigate("/auth/sign-in", { replace: true });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center justify-center w-full max-w-md p-10 bg-card rounded-lg shadow-lg border m-4">
        <h1 className="mb-8 text-3xl font-semibold text-center bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          Create Account
        </h1>
        <p className="text-muted-foreground text-sm mb-8 text-center">
          Sign up to get started with your new account
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full space-y-5"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="Email address" 
                      type="email" 
                      className="h-11 px-4"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      type="password"
                      autoComplete="new-password"
                      className="h-11 px-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword" 
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Confirm Password"
                      type="password"
                      autoComplete="new-password"
                      className="h-11 px-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <Button type="submit" className="h-11 font-medium hover:shadow-md transition-all">
              Sign Up
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link
              to="/auth/sign-in"
              className={buttonVariants({ 
                variant: "link",
                className: "text-sm text-muted-foreground hover:text-foreground"
              })}
            >
              Already have an account? Sign in
            </Link>
          </div>
        </Form>

        <Separator className="my-8" />
      </div>

      <Dialog
        open={showEmailVerificationDialog}
        onOpenChange={(open) => setShowEmailVerificationDialog(open)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Verification email sent</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            You need to verify your email first. Please check your mailbox and
            follow the confirmation link to complete the registration.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
