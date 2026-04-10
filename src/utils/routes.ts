export class ROUTES {
  static get base() {
    return `/` as const;
  }

  static get example() {
    return `/example` as const;
  }

  static exampleDetail() {
    return `${this.example}/detail` as const;
  }

  static exampleItem(exampleId: string): string {
    return `${this.example}/${exampleId}` as const;
  }

  static exampleSubItem(exampleId: string, itemId: string): string {
    return `${this.example}/${exampleId}/${itemId}` as const;
  }
}
