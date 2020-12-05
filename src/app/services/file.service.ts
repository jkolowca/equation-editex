import { Injectable } from '@angular/core';
import { EqComponent } from '../helpers/components';
import { parseTex } from '../helpers/parsers';
import { EquationService } from './equation.service';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private equationService: EquationService) { }

  files: { file: File, valid: boolean, message?: string, content?: EqComponent[] }[] = [];

  async openFiles(event): Promise<void> {
    let files: any[] = [...event.addedFiles];
    files = await Promise.all(files.map(async f => {
      const valid = await this.validateFile(f);
      return { file: f, ...valid };
    }));
    this.files.push(...files);
  }

  openEquations(): void {
    this.equationService.loadDocumentsFromFiles(
      this.files
        .filter(f => f.valid)
        .map(f => ({ name: f.file.name.slice(0, -4), equation: f.content }))
    );
    this.files = [];
  }

  async validateFile(file: File): Promise<{ valid: boolean, message?: string }> {
    const res: any = {};
    res.valid = file.type === 'text/plain' || file.name.substr(-3) === 'tex';
    if (!res.valid) { res.message = 'Wrong file type'; }
    else {
      try {
        res.content = parseTex(await file.text());
      } catch (e) {
        res.valid = false;
        res.message = 'File should only contain valid mathematical expressions';
      }
    }
    return res;
  }

  cancel(): void {
    this.files = [];
  }

  onRemove(event): void {
    this.files.splice(this.files.indexOf(event), 1);
  }

  saveToFile(content: string, fileName: string): void {
    const blob = new Blob([content], { type: 'type/plain;charset=utf=8' });
    saveAs(blob, fileName + '.tex');
  }
}
