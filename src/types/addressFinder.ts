
export interface AddressFinderMetaData {
  address?: string;
  city?: string;
  postcode?: string;
  region?: string;
  a?: string;
  pxid?: string;
  x?: number;
  y?: number;
  street?: string;
  suburb?: string;
  country?: string;
  selected_via?: string;
}

export interface AddressFinderWidget {
  on: (event: string, callback: (fullAddress: string, metaData: AddressFinderMetaData) => void) => void;
  destroy: () => void;
}
