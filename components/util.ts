import {
  ApolloClient,
  InMemoryCache,
  gql,
} from "@apollo/client";
import { ethers } from 'ethers';

export function checkIfLensHandle(name: string) {
  if (name.slice(-5) == ".lens") return name;
  return undefined;
}

export function checkIfEthAddress(name: string) {
  if (ethers.utils.isAddress(name)) return name;
  return undefined;
}

export async function lensToAddress(handle: string | string[] | undefined) {
  if (!handle) return undefined;

  const profileQuery = gql`
        query ProfileQuery($request: SingleProfileQueryRequest!) {
          profile(request: $request) {
            ownedBy
          }
        }
      `;

  const profileQueryParams = {
    request: {
      handle: handle,
    },
  };

  const client = new ApolloClient({
    uri: "https://api.lens.dev",
    cache: new InMemoryCache(),
  });

  const response = await client.query({
    query: profileQuery,
    variables: profileQueryParams,
  });

  if (response.data.profile != null) return response.data.profile.ownedBy;
  return undefined;
}

export async function addressToLens(address: string | string[] | undefined) {
  if (!address) return undefined;
  // note: this gets default lens profile
  const profileQuery = gql`
        query DefaultProfile($request: DefaultProfileRequest!) {
          defaultProfile(request: $request) {
            id
            handle
          }
        }
      `;

  const profileQueryParams = {
    request: {
      ethereumAddress: address
    },
  };

  const client = new ApolloClient({
    uri: "https://api.lens.dev",
    cache: new InMemoryCache(),
  });

  const response = await client.query({
    query: profileQuery,
    variables: profileQueryParams,
  });

  if (response.data.defaultProfile != null) return response.data.defaultProfile.handle;
  return undefined;
}