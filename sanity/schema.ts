import { course } from './schemas/course';
import { lecturer } from './schemas/lecturer';
import { sectionPage } from './schemas/sectionPage';
import { blockContent } from './schemas/blockContent';
import { highlightContent } from './schemas/highlightContent';
import { tag } from './schemas/tag';
import { highlightBox } from './schemas/highlightBox';

export const schemaTypes = [tag, highlightBox, course, lecturer, sectionPage, blockContent, highlightContent];
