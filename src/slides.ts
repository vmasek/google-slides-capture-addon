import Folder = GoogleAppsScript.Drive.Folder;

const MAIN_FOLDER = 'Captured slides';

/**
 * Runs when the add-on is installed.
 */
function onInstall(): void {
  onOpen();
}

/**
 * Trigger for opening a presentation.
 */
function onOpen(): void {
  SlidesApp.getUi()
    .createAddonMenu()
    .addItem('Save thumbnails', saveThumbnailImages.name)
    .addToUi();
}

/**
 * Saves a thumbnail images of the current Google Slide presentation in Google Drive folder.
 */
function saveThumbnailImages(): void {
  const presentation = SlidesApp.getActivePresentation();
  const presentationName = presentation.getName();
  const presentationId = presentation.getId();
  const date = new Date().toISOString();

  const folder = getFolder(
    `${presentationName}_${date}`,
    getFolder(MAIN_FOLDER),
  );

  const slideTitles: { [key: string]: string } = Slides.Presentations!.get(
    presentationId,
  ).slides!.reduce<{}>(
    (acc, slide) => ({
      ...acc,
      [slide.objectId!]: slide
        .pageElements!.filter(
          ({ shape }) =>
            shape &&
            shape.placeholder &&
            // fixme: Placeholder type is string and not GoogleAppsScript.Slides.PlaceholderType (probably a docs error)
            (shape.placeholder.type === 'TITLE' ||
              shape.placeholder.type === 'CENTERED_TITLE'),
        )
        .map(({ shape }) =>
          shape!
            .text!.textElements!.map(({ textRun }) =>
              textRun ? textRun.content : '',
            )
            .join(''),
        )
        .join(' '),
    }),
    {},
  );

  const images = presentation.getSlides().map((slide, index) =>
    UrlFetchApp.fetch(
      Slides.Presentations!.Pages!.getThumbnail(
        presentationId,
        slide.getObjectId(),
        {
          // 'thumbnailProperties.mimeType': 'PNG',
          'thumbnailProperties.thumbnailSize': 'LARGE',
        },
      ).contentUrl!,
    )
      .getBlob()
      .setName(
        `${presentationName}-${index}-${slideTitles[slide.getObjectId()]}`,
      ),
  );

  images.forEach(image => folder.createFile(image));
}

function getFolder(
  name: string,
  root: GoogleAppsScript.Drive.DriveApp | Folder = DriveApp,
): Folder {
  return root.getFoldersByName(name).hasNext()
    ? root.getFoldersByName(name).next()
    : root.createFolder(name);
}
