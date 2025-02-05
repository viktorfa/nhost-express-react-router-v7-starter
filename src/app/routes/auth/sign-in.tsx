import { zodResolver } from "@hookform/resolvers/zod";
import { useSignInEmailPassword } from "@nhost/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
//import SignInFooter from "@/components/auth/sign-in-footer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function SignInEmailPassword() {
  const navigate = useNavigate();
  const [showEmailVerificationDialog, setShowEmailVerificationDialog] = useState(false);

  const [otp, setOtp] = useState("");
  const { signInEmailPassword, needsMfaOtp, sendMfaOtp } = useSignInEmailPassword();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;
    const result = await signInEmailPassword(email, password);
    if (result.isError) {
      toast.error(result.error?.message);
    } else if (result.needsEmailVerification) {
      setShowEmailVerificationDialog(true);
    } else if (result.isSuccess) {
      navigate("/dashboard", { replace: true });
    }
  };

  const sendOtp = async () => {
    const result = await sendMfaOtp(otp);
    if (result.isError) {
      toast.error(result.error?.message);
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  if (needsMfaOtp) {
    return (
      <div className="flex flex-row items-center justify-center w-screen min-h-screen bg-gray-100">
        <div className="flex flex-col items-center justify-center w-full max-w-md gap-4 p-8 bg-white rounded-md shadow">
          <h1 className="text-3xl text-center ">TOTP</h1>
          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="One-time password"
            autoFocus
          />
          <Button className="w-full" onClick={sendOtp}>
            Send 2-step verification code
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center justify-center w-full max-w-md p-10 bg-card rounded-lg shadow-lg border m-4">
        <h1 className="mb-8 text-3xl font-semibold text-center bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-muted-foreground text-sm mb-8 text-center">
          Please sign in to continue to your account
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full space-y-5">
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
                      autoComplete="none"
                      className="h-11 px-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <Button type="submit" className="h-11 font-medium hover:shadow-md transition-all">
              Sign In
            </Button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <Link
              to="/auth/forgot-password"
              className={buttonVariants({
                variant: "link",
                className: "text-sm text-muted-foreground hover:text-foreground",
              })}
            >
              Forgot your password?
            </Link>
            <div>
              <Link
                to="/auth/sign-up"
                className={buttonVariants({
                  variant: "link",
                  className: "text-sm text-muted-foreground hover:text-foreground",
                })}
              >
                Don't have an account? Sign up
              </Link>
            </div>
          </div>
        </Form>

        <Separator className="my-8" />

        {/*<SignInFooter />*/}
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
            You need to verify your email first. Please check your mailbox and follow the
            confirmation link to complete the registration.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
