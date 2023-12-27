type BooleanTypes = 'true' | '1' | 'false' | '0';
export class CommonUtils {
  static booleanify(value: BooleanTypes): boolean {
    const truthy: string[] = ['true'];
    return truthy.includes(value);
  }
}
