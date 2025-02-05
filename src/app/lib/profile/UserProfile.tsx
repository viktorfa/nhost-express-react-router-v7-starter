import { LoadingElement } from "@/components/LoadingElement";
import { gql, useQuery } from "@apollo/client";
import { useUserData } from "@nhost/react";
import { useForm } from "react-hook-form";

export const UserProfile = () => {
  const user = useUserData();

  const { data, loading, error } = useQuery<
    GQL_GET_USER_WITH_USER_PROFILE_QUERY,
    GQL_GET_USER_WITH_USER_PROFILE_QUERY_VARIABLES
  >(
    gql`
      query GET_USER_WITH_USER_PROFILE($id: uuid!) {
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
      </div>
    );
  }
};
