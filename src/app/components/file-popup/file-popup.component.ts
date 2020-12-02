import { Component, HostBinding } from '@angular/core';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-file-popup',
  templateUrl: './file-popup.component.html',
  styleUrls: ['./file-popup.component.scss']
})
export class FilePopupComponent {
  @HostBinding('style.display') display: string;
  constructor(public fileService: FileService) {
    this.display = 'none';
  }

  openPopup(): void {
    this.display = 'block';
  }

  closePopup(): void {
    this.display = 'none';
  }

  async onApply(): Promise<void> {
    this.closePopup();
    await this.fileService.openEquations();
  }

  onCancel(): void {
    this.closePopup();
    this.fileService.cancel();
  }
}
