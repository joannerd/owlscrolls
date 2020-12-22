export interface IScroll {
  type: string;
  name: string;
  lowPrice: string;
  highPrice: string;
}

export interface IScrolls {
  [type: string]: IScroll;
}

export interface IScrollList {
  type: string;
  items: IScroll[];
}

export interface IScrollLists {
  [type: string]: IScrollList;
}

export interface IOwlRepoItem {
  search_item: string;
  p0: number;
  p25: number;
  p50: number;
  p75: number;
  p100: number;
  mean: number;
  task_id?: string;
  client_thumbprint?: string;
  search_item_timestamp?: string;
  search_results?: number;
  search_results_captured?: number;
  sum_bundle?: number;
  num_outlier?: number;
  percent_complete?: number;
  std?: number;
  n_owled?: number;
}

export interface IFormattedScrollData {
  scrolls: IScrollList[];
  scrollTypes: string[];
}
