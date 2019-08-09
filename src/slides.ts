import Folder = GoogleAppsScript.Drive.Folder;
import PlaceholderType = GoogleAppsScript.Slides.PlaceholderType;

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
    .addItem('Save thumbnail', saveThumbnailImages.name)
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

  Slides.Presentations.get(presentationId).slides.forEach(slide => {
    slide.pageElements
      .filter(
        ({ shape }) =>
          shape &&
          shape.placeholder &&
          // fixme: Placeholder type is string and not GoogleAppsScript.Slides.PlaceholderType (probably a docs error)
          (shape.placeholder.type === 'TITLE' ||
            shape.placeholder.type === 'CENTERED_TITLE'),
      )
      .forEach(({ shape }) => {
        const texts = shape.text.textElements
          .map(text => (text.textRun ? text.textRun.content : ''))
          .join('');
        console.log('texts', texts);
      });
  });

  const images = presentation.getSlides().map((slide, index) =>
    UrlFetchApp.fetch(
      Slides.Presentations.Pages.getThumbnail(
        presentationId,
        slide.getObjectId(),
        {
          // 'thumbnailProperties.mimeType': 'PNG',
          'thumbnailProperties.thumbnailSize': 'LARGE',
        },
      ).contentUrl,
    )
      .getBlob()
      .setName(`${presentationName}-slide-${index}`),
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
