import Folder = GoogleAppsScript.Drive.Folder;

const MAIN_FOLDER = 'Captured slides';

enum SlideLevel {
  Section = 0,
  SubSlide = 1,
}

interface SlideMetadata {
  level: SlideLevel;
  name?: string;
}

/**
 * Runs when the add-on is installed.
 */
export function onInstall(): void {
  onOpen();
}

/**
 * Trigger for opening a presentation.
 */
export function onOpen(): void {
  SlidesApp.getUi()
    .createAddonMenu()
    .addItem('Save thumbnails', saveThumbnailImages.name)
    .addToUi();
}

interface SlideNames {
  currentSectionMetadata: SlideMetadata;
  [custom: string]: string | SlideMetadata;
}

/**
 * Saves a thumbnail images of the current Google Slide presentation in Google Drive folder.
 */
export function saveThumbnailImages(): void {
  const presentation = SlidesApp.getActivePresentation();
  const presentationName = presentation.getName();
  const presentationId = presentation.getId();
  const date = new Date().toISOString();

  const folder = getFolder(
    `${presentationName}_${date}`,
    getFolder(MAIN_FOLDER),
  );

  const slideTitles = Slides.Presentations?.get(presentationId).slides?.reduce<
    SlideNames
  >(
    (acc, slide, slideNumber): SlideNames => {
      const slideMetadataString = slide.pageElements
        ?.map(({ shape }) =>
          shape?.text?.textElements
            ?.map(({ textRun }) => (textRun ? textRun.content : ''))
            .join('')
            .trim(),
        )
        .filter(
          (text): text is string =>
            !!text && text.startsWith('{') && text.endsWith('}'),
        )
        .join('');

      if (!slideMetadataString) {
        return acc;
      }

      let slideMetadata: SlideMetadata;

      try {
        slideMetadata = JSON.parse(slideMetadataString);
      } catch (e) {
        console.error(
          `Invalid metadata format at slide ${slideNumber + 1}\n`,
          'Metadata should be in JSON format',
          slideMetadataString,
        );
        return acc;
      }

      switch (slideMetadata.level) {
        case SlideLevel.Section:
          return {
            ...acc,
            currentSectionMetadata: slideMetadata,
          };
        case SlideLevel.SubSlide:
          return {
            ...acc,
            // tslint:disable-next-line:no-non-null-assertion
            [slide.objectId!]: `${acc.currentSectionMetadata.name}${
              slideMetadata.name ? `_${slideMetadata.name}` : ''
            }`,
          };
        default:
          return acc;
      }
    },
    {
      currentSectionMetadata: {
        level: SlideLevel.Section,
        name: '',
      },
    },
  );

  if (!slideTitles) {
    return;
  }

  const images = presentation
    .getSlides()
    .filter(slide => slideTitles[slide.getObjectId()])
    .reverse()
    .map(slide =>
      UrlFetchApp.fetch(
        // tslint:disable-next-line:no-non-null-assertion
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
        .setName(`${slideTitles[slide.getObjectId()]}`),
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
