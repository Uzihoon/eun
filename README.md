# [EUN](https://daeunyoon.com)

EUN is the website provides the easy way to analyze CRISPR/Cas efficiency.

## [Cas Analysis](https://daeunyoon.com/#/analysis)

You can analysis CRISPR/Cas with more than one sequencing data (paired-end reads). Also, can run even more than 100 .gz file.

If you want to test analysis, just click 'Run analysis sample file'.

You can also analyze CRISPR/Cas by the json file in one seconds. Just download json file after first analyzed CRISPR/Cas and click 'Analyze by json file'.

- **File Name Pattern (Optional)**
  This is necessary to identify the gz file. If you omit this box, unique id will be the text before the 'File Index Pattern'.
  eg.
  File Name: Sample-ID-86*S86_L001_R1_001.fastq.gz
  File Name Pattern: Sample-ID
  File Index Pattern: \_L001*
  File ID: 86_S86

- **File Index Pattern**
  Required for indexing the files.
- **Sequencing Data (Paired-end reads)**
  Input files for analyze it. Should be gz file for analyze CRISPR/Cas.
- **Reference Amplicon Sequence**
  Reference Amplicon Sequence
- **Used Cas otholog**
  EUN only provides NGG types, but someday more will be added for analysis.
- **Target DNA sequence (5 to 3, without PAM sequence)**
  Target DNA sequence
- **Standard Range**
  Standard target range
- **Target Nucleotide**
  Input the unchanged nucleotide type.
- **Desired change of target nucleotide**
  Input the changed nucleotide type.

## [INDEL Type Report](https://daeunyoon.com/#/indel)

Shows the average of insertion and deletion as a line chart. You need the json file downloaded after CRISPR/Cas analysis. Also could download the chart by png file.

## [File Convert](https://daeunyoon.com/#/convert)

You can convert the file or change the sequence data. Click the button what you want to convert and after convert it would be downloaded for zip file.

- **Reverse sequence**
  It makes reverse the original and changed sequence.
- **Reverse nucleotide**
  It makes reverse the nucleotide A to T, G to C.
- **Merge files**
  Get the analyzed file or INDEL chart in one file.
