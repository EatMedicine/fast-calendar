//------------------------------------------------------------------------------
// <auto-generated>
//     此代码已从模板生成。
//
//     手动更改此文件可能导致应用程序出现意外的行为。
//     如果重新生成代码，将覆盖对此文件的手动更改。
// </auto-generated>
//------------------------------------------------------------------------------

namespace fast_calendar_background.Models
{
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    
    public partial class Tip
    {
        public int id { get; set; }
        public string Title { get; set; }
        public int TipStatus { get; set; }
        public int IsShow { get; set; }
        public int IsDisable { get; set; }
        public System.DateTime TipDate { get; set; }
        public Nullable<int> userId { get; set; }
        [JsonIgnore]
        public virtual UserLogin UserLogin { get; set; }
    }
}
