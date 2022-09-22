export class CommonHelper {
  public static convertTemplateStringWithObjectProperties(
    templateString: string,
    objectProperties: Record<string, any>,
  ) {
    if (!objectProperties) {
      return templateString;
    }
    Object.keys(objectProperties).forEach((key) => {
      templateString = templateString.replace(`{${key}}`, objectProperties[key]);
    });
    return templateString;
  }
}
