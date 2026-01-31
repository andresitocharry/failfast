
import { gql } from "@apollo/client";

export const GET_CONTRACTS = gql`
  query GetContracts {
    contracts {
      id
      title
      client
      type
      status
      progress
      value
      location
      start_date
      end_date
    }
  }
`;

export const GET_CONTRACT_DETAIL = gql`
  query GetContractDetail($id: String!) {
    contracts_by_pk(id: $id) {
      id
      title
      client
      type
      status
      progress
      value
      start_date
      end_date
      location
      phase
      health
      risk_level
      project_manager_id
      project_manager {
        name
      }
      milestones {
        id
        name
        phase
        due_date
        status
        value
        deliverables
      }
      contract_team_members {
        user {
          id
          name
          role
          email
          status
        }
      }
      documents {
        id
        name
        type
        upload_date
        uploaded_by
        size
        status
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      role
      email
      status
    }
  }
`;

